let users = {}; // Stores userId -> socketId mapping
let sharingHistory = {}; // Add this at the top with other variables

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
        });

        // Receive location updates and send them to friends' rooms
        socket.on("shareLocation", async (data) => {
            console.log(data);
            const { userName:username, latitude, longitude } = data;
            
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

            // Fetch friends from backend (Assume DB call)
            const friends = await getFriendsFromDatabase(username);

            // Emit location update only to friends' rooms
            friends.forEach((friendUsername) => {
                io.to(friendUsername).emit("locationUpdate", { username, latitude, longitude });
            });

            console.log(`Shared location of ${username} with ${friends}`);
        });

        socket.on("stopSharing", async (data) => {
            const { userName } = data;
            if (sharingHistory[userName]) {
                sharingHistory[userName].isActive = false;
                sharingHistory[userName].endTime = new Date().toISOString();
                
                const friends = await getFriendsFromDatabase(userName);
                console.log(`${data.username} stopped sharing with`,friends)
                friends.forEach((friendUsername) => {
                    io.to(friendUsername).emit("sharingEnded", {
                        username: userName,
                        sharingDetails: sharingHistory[userName]
                    });
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
    // Assume we have a database call that fetches friend IDs of the user
    if(username==="JohnDoe")
        return ["Anushka"]
    else if(username==="Anushka")
        return ["JohnDoe"]
    else
        return []; // Replace with actual implementation
    // Replace with actual friend IDs
};

// Add this helper function
const getPlaceName = async (latitude, longitude) => {
    // Implement reverse geocoding here (using Google Maps or other service)
    return "Sample Location"; // Replace with actual implementation
};

module.exports = { initializeSocket };
