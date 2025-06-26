import SOSAlert from '../model/SOSAlert.js';
import EmergencyContact from '../model/emergency-contact.js';
import { generateOTP, sendOTP, verifyOTP } from '../services/otpService.js';
import { logEvent } from './auditLogController.js';

const activeSOSAlerts = new Map();

const sosController = {
    triggerSOS: async (req, res) => {
        try {
            const user = req.user.id;
            const { location } = req.body; // { coordinates: [lon, lat] }
            // Generate OTP
            const otp = generateOTP();
            const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min expiry
            // Create SOS alert
            const sosAlert = await SOSAlert.create({ user, location, otp, otpExpires, status: 'active' });
            // Get contacts and send notifications
            const contacts = await EmergencyContact.find({ $or: [{ user }, { isGlobal: true }] });
            contacts.forEach(c => { /* TODO: Send multi-channel notifications */ });
            // Send OTP to user's primary contact method (e.g., email)
            await sendOTP(otp, req.user); // Assuming req.user has email/phone
            // Log event
            await logEvent(user, 'SOS', sosAlert._id, { location, status: 'active' });
            res.status(201).json({ success: true, sosId: sosAlert._id });
        } catch (err) { res.status(500).json({ error: err.message }); }
    },

    uploadSOSMedia: async (req, res) => {
        try {
            const { sosId } = req.params;
            const { type } = req.body;
            const fileUrl = req.file ? req.file.path : null;
            if (!fileUrl) return res.status(400).json({ error: 'No file uploaded' });
            const sosAlert = await SOSAlert.findById(sosId);
            if (!sosAlert) return res.status(404).json({ error: 'SOS alert not found' });
            sosAlert.media.push({ type, url: fileUrl });
            await sosAlert.save();
            res.json({ success: true, media: sosAlert.media });
        } catch (err) { res.status(500).json({ error: err.message }); }
    },

    endSOS: async (req, res) => {
        try {
            const { sosId } = req.params;
            const { otp } = req.body;
            const sosAlert = await SOSAlert.findById(sosId);
            if (!sosAlert) return res.status(404).json({ error: 'SOS alert not found' });
            if (sosAlert.otpExpires < new Date()) return res.status(400).json({ error: 'OTP expired' });
            if (!verifyOTP(otp, sosAlert.otp)) return res.status(400).json({ error: 'Invalid OTP' });
            sosAlert.status = 'resolved';
            sosAlert.resolvedAt = new Date();
            sosAlert.resolvedBy = req.user.id;
            await sosAlert.save();
            // TODO: Send "all clear" notifications
            await logEvent(req.user.id, 'SOS', sosAlert._id, { status: 'resolved' });
            res.json({ success: true, status: sosAlert.status });
        } catch (err) { res.status(500).json({ error: err.message }); }
    }
};

module.exports = sosController;