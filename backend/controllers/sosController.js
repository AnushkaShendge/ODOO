const { sendSOSAlert } = require('../Services/mailService');
const User = require('../model/user');

// Store OTPs in memory (use Redis in production)
const activeSOSAlerts = new Map();

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const sosController = {
    triggerSOS: async (req, res) => {
        try {
            const { userName, location } = req.body;

            // Get user's emergency contacts
            // const user = await User.findOne({ username: userName });
            // if (!user) {
            //     return res.status(404).json({ message: 'User not found' });
            // }

            const otp = generateOTP();
            activeSOSAlerts.set(userName, otp);

            // Send alerts to all emergency contacts
            // const emailPromises = user.emergencyContacts.map(async contact => {
            //     return sendSOSAlert({
            //         userName,
            //         location,
            //         friendEmail: contact.email || "harshit.bhanushali22@spit.ac.in",
            //         otp
            //     });
            // });
            const emailPromises = [
                sendSOSAlert({
                    userName,
                    location,
                    friendEmail: "harshit.bhanushali22@spit.ac.in",
                    otp
                })
            ];

            await Promise.all(emailPromises);

            res.status(200).json({ 
                success: true, 
                message: 'SOS alerts sent successfully' 
            });

        } catch (error) {
            console.error('Error in triggerSOS:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Failed to trigger SOS' 
            });
        }
    },

    verifyOTP: async (req, res) => {
        try {
            const { userName, otp } = req.body;
            const storedOTP = activeSOSAlerts.get(userName);

            if (!storedOTP) {
                return res.status(400).json({
                    success: false,
                    message: 'No active SOS alert found'
                });
            }

            if (storedOTP === otp) {
                activeSOSAlerts.delete(userName);
                res.status(200).json({
                    success: true,
                    message: 'SOS deactivated successfully'
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: 'Invalid OTP'
                });
            }

        } catch (error) {
            console.error('Error in verifyOTP:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to verify OTP'
            });
        }
    }
};

module.exports = sosController;