const { sendSOSAlert } = require('../Services/mailService');
const User = require('../model/user');

const activeSOSAlerts = new Map();

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const sosController = {
    triggerSOS: async (req, res) => {
        try {
            const { userName, location } = req.body;
            const recordingFile = req.files?.recording?.[0];
            const photoFile = req.files?.photo?.[0];

            console.log('Received SOS request:', { userName, location, recordingFile, photoFile });

            const otp = generateOTP();
            activeSOSAlerts.set(userName, otp);

            // Parse the location field if provided
            const validLocation = location ? JSON.parse(location) : null;

            // Send the email with attachments
            await sendSOSAlert({
                userName,
                location: validLocation,
                friendEmail: "harshit.bhanushali22@spit.ac.in",
                otp,
                recordingUri: recordingFile ? recordingFile.buffer : null,
                photoUris: photoFile ? [photoFile.buffer] : []
            });

            res.status(200).json({ 
                success: true, 
                message: 'SOS alerts sent successfully with media attachments' 
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
            console.log(req.body);
            const storedOTP = activeSOSAlerts.get(userName);

            if (!storedOTP) {
                return res.status(400).json({
                    success: false,
                    message: 'No active SOS alert found'
                });
            }
            console.log(storedOTP);
            if (storedOTP == otp) {
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