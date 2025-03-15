let users = {}; // Stores userId -> socketId mapping

const initializeSocket = (io) => {
    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.id}`);

        // User joins their own room
        socket.on("joinRoom", (username) => {
            socket.join(username);
            console.log(`User ${username} joined room ${username}`);
        });

        // Receive location updates and send them to friends' rooms
        socket.on("shareLocation", async (data) => {
            console.log(data);
            const { userName:username, latitude, longitude } = data;
            // Fetch friends from backend (Assume DB call)
            const friends = await getFriendsFromDatabase(username);

            // Emit location update only to friends' rooms
            friends.forEach((friendUsername) => {
                io.to(friendUsername).emit("locationUpdate", { username, latitude, longitude });
            });

            console.log(`Shared location of ${username} with ${friends}`);
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
    return ["Anushka"]; // Replace with actual friend IDs
};

module.exports = { initializeSocket };
