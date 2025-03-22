let users = {}; // Stores userId -> socketId mapping
let sharingHistory = {}; // Add this at the top with other variables
const User = require('../model/user')
const History = require('../model/History');

const initializeSocket = (io) => {
    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.id}`);

        // User joins their own room
        socket.on("joinRoom", (username) => {
            socket.join(username);
            console.log(`User ${username} joined room ${username}`);
        });

        socket.on("startSharing", (data) => {
            const { userName } = data;

            sharingHistory[userName] = {
                startTime: new Date().toISOString(),
                locations: [],
                isActive: true
            };
            console.log("start sharing",sharingHistory[userName]);
        });

        // Receive location updates and send them to friends' rooms
        socket.on("shareLocation", async (data) => {
            console.log(data);
            const { userName: username, latitude, longitude } = data;

            // Add location to history if sharing is active
            if (sharingHistory[username]?.isActive) {
                const placeName = await getPlaceName(latitude, longitude);
                sharingHistory[username].locations.push({
                    latitude,
                    longitude,
                    placeName,
                    timestamp: new Date().toISOString()
                });
            }

            try {
                const friends = await getFriendsFromDatabase(username);
                
                // Emit location update only to friends' rooms
                friends.forEach((friend) => {
                    io.to(friend).emit("locationUpdate", { 
                        username, 
                        latitude, 
                        longitude 
                    });
                });

                console.log(`Shared location of ${username} with friends:`, friends);
            } catch (error) {
                console.error(`Error in shareLocation for user ${username}:`, error);
            }
        });

        socket.on("stopSharing", async (data) => {
            const { userName } = data;
            console.log("Stop sharing request received from:", userName);

            if (sharingHistory[userName] && sharingHistory[userName].isActive) {
                sharingHistory[userName].isActive = false;
                sharingHistory[userName].endTime = new Date().toISOString();
                
                try {
                    // Get user from database
                    const user = await User.findOne({ name: userName });
                    if (!user) {
                        throw new Error('User not found');
                    }

                    // Create history record
                    const historyRecord = new History({
                        userId: user._id,
                        userName: userName,
                        startTime: new Date(sharingHistory[userName].startTime),
                        endTime: new Date(sharingHistory[userName].endTime),
                        locations: sharingHistory[userName].locations.map(loc => ({
                            ...loc,
                            timestamp: new Date(loc.timestamp)
                        })),
                        isActive: false
                    });

                    // Save to database
                    await historyRecord.save();
                    console.log('Location history saved to database');

                    const friends = await getFriendsFromDatabase(userName);
                    console.log(`${userName} stopped sharing with:`, friends);

                    // Send sharing ended event to each friend with the saved history
                    friends.forEach((friendUsername) => {
                        io.to(friendUsername).emit("sharingEnded", {
                            username: userName,
                            sharingDetails: sharingHistory[userName]
                        });
                    });

                    // Cleanup sharing history after sending
                    delete sharingHistory[userName];
                    
                } catch (error) {
                    console.error(`Error in stopSharing for user ${userName}:`, error);
                }
            } else {
                console.warn(`No active sharing session found for user ${userName}`);
            }
        });

        socket.on("simulateOffline", async (data) => {
            const { userName } = data;
            console.log(`Simulating offline prediction for user ${userName}`);

            try {
                // Check if user has active sharing session
                if (!sharingHistory[userName] || !sharingHistory[userName].isActive) {
                    throw new Error('No active sharing session found');
                }

                // Get user's location history
                const locationHistory = sharingHistory[userName].locations;
                
                if (locationHistory.length < 3) {
                    throw new Error('Not enough location data for prediction');
                }

                // Make prediction using Gemini API
                const predictedPath = await predictPath(userName, locationHistory);
                
                // Get user's friends
                const friends = await getFriendsFromDatabase(userName);
                
                // Send predicted path to friends
                friends.forEach((friendUsername) => {
                    io.to(friendUsername).emit("predictedPath", {
                        username: userName,
                        predicted: predictedPath,
                        isOfflineSimulation: true
                    });
                });

                // Also send confirmation to the user
                io.to(userName).emit("offlineSimulationStarted", {
                    success: true,
                    predictedLocations: predictedPath.predictedLocations.length
                });

                console.log(`Sent predicted path for ${userName} to friends:`, friends);
            } catch (error) {
                console.error(`Error in offline simulation for user ${userName}:`, error);
                // Send error to user
                io.to(userName).emit("offlineSimulationStarted", {
                    success: false,
                    error: error.message
                });
            }
        });

        // Handle disconnect
        socket.on("disconnect", () => {
            const userId = Object.keys(users).find((key) => users[key] === socket.id);
            if (userId) {
                delete users[userId];
                console.log(`User ${userId} disconnected`);
            }
        });
    });

    return io;
};

// Mock function to fetch friends (Replace with DB call)
const getFriendsFromDatabase = async (username) => {
    try {
        if (!username) {
            throw new Error('Username is required');
        }

        const user = await User.findOne({ name: username })
            .populate({
                path: 'friends',
                select: 'name email phone'
            });
        
        if (!user) {
            console.warn(`User ${username} not found`);
            return [];
        }

        // If user has no friends, return empty array
        if (!user.friends) {
            return [];
        }

        // Filter out any null/undefined entries and map to names
        return user.friends
            .filter(friend => friend && friend.name)
            .map(friend => friend.name);
    } catch (error) {
        console.error(`Error fetching friends for user ${username}:`, error);
        return [];
    }
};

// Add this helper function
const getPlaceName = async (latitude, longitude) => {
    // Implement reverse geocoding here (using Google Maps or other service)
    return "Sample Location"; // Replace with actual implementation
};

const predictPath = async (username, locationHistory) => {
    try {
        // Option 1: Direct call to Gemini API
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY; // Set this in your environment variables
        const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
        
        // Format location history for the API
        const formattedLocations = locationHistory.map(loc => ({
            latitude: loc.latitude,
            longitude: loc.longitude,
            timestamp: loc.timestamp
        }));

        // Create prompt for Gemini
        const prompt = {
            contents: [{
                parts: [{
                    text: `Based on the following user location history, predict the next 5 possible locations the user might go to in the next 30 minutes. Return the response as a JSON array of objects with latitude, longitude, and timestamp. Here is the location history: ${JSON.stringify(formattedLocations)}`
                }]
            }]
        };

        // Call Gemini API
        const response = await axios.post(
            `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, 
            prompt,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        // Extract predicted locations from response
        let predictedLocations = [];
        
        // Safely extract the text content from Gemini response
        const textContent = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (textContent) {
            // Extract JSON array from the text response
            const jsonMatch = textContent.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                predictedLocations = JSON.parse(jsonMatch[0]);
            } else {
                // Fallback if we can't find a JSON array
                throw new Error('Failed to parse Gemini response');
            }
        } else {
            throw new Error('Invalid response from Gemini API');
        }

        return {
            username,
            originalLocations: locationHistory,
            predictedLocations,
            predictionTime: new Date().toISOString()
        };

        // Option 2: Call to Flask backend (uncomment if using this approach)
        /*
        const FLASK_API_URL = 'http://your-flask-server/predict';
        const response = await axios.post(FLASK_API_URL, {
            username,
            locationHistory
        });
        return response.data;
        */
    } catch (error) {
        console.error('Error predicting path:', error);
        throw new Error(`Failed to predict path: ${error.message}`);
    }
};

module.exports = { initializeSocket };
