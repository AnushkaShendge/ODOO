const FriendRequest = require('../../model/friend-request');
const User = require('../../model/user');

const initializzeSocket = (io) => {
    io.on('connection', (socket) => {
        // Send friend request
        socket.on('send_friend_request', async ({ senderId, receiverId }) => {
            try {
                const newRequest = await FriendRequest.create({
                    sender: senderId,
                    receiver: receiverId,
                    status: 'pending'
                });
                
                io.to(receiverId).emit('new_friend_request', newRequest);
            } catch (error) {
                console.error('Friend request error:', error);
            }
        });

        // Accept friend request
        socket.on('accept_friend_request', async ({ requestId }) => {
            try {
                const request = await FriendRequest.findById(requestId);
                if (!request) return;

                request.status = 'accepted';
                await request.save();

                // Add users to each other's friend lists
                await User.findByIdAndUpdate(request.sender, {
                    $addToSet: { friends: request.receiver }
                });
                await User.findByIdAndUpdate(request.receiver, {
                    $addToSet: { friends: request.sender }
                });

                io.to(request.sender.toString()).emit('friend_request_accepted', request);
                io.to(request.receiver.toString()).emit('friend_request_accepted', request);
            } catch (error) {
                console.error('Accept friend request error:', error);
            }
        });

        // Get pending requests
        socket.on('get_pending_requests', async ({ userId }) => {
            try {
                const pendingRequests = await FriendRequest.find({
                    receiver: userId,
                    status: 'pending'
                }).populate('sender', 'name email');
                
                socket.emit('pending_requests', pendingRequests);
            } catch (error) {
                console.error('Get pending requests error:', error);
            }
        });
    });
};

module.exports = initializzeSocket;