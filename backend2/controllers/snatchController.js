const SnatchEvent = require('../models/snatchEvent');
const User = require('../models/user');
// const twilio = require('twilio'); // Uncomment and configure if using Twilio
// const axios = require('axios'); // For Google Maps API if needed

// Start a snatch detection event
exports.startSnatchEvent = async (req, res) => {
  try {
    const { userId, startLocation, route } = req.body;
    if (!userId || !startLocation || !startLocation.lat || !startLocation.lng) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const event = await SnatchEvent.create({
      user: userId,
      startLocation,
      route: route || []
    });
    res.status(201).json({ success: true, event });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Resolve a snatch event
exports.resolveSnatchEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await SnatchEvent.findByIdAndUpdate(
      eventId,
      { status: 'resolved', resolvedAt: new Date() },
      { new: true }
    );
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json({ success: true, event });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Predict safe route (stub)
exports.predictSafeRoute = async (req, res) => {
  try {
    // In production, call ML microservice or Google Maps Directions API
    const { startLocation, endLocation } = req.body;
    if (!startLocation || !endLocation) {
      return res.status(400).json({ error: 'Missing start or end location' });
    }
    // Stub: return a fake route
    const route = [startLocation, endLocation];
    res.json({ success: true, route, message: 'Stub: Replace with real route prediction' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Send SMS fallback (stub)
exports.sendFallbackSMS = async (req, res) => {
  try {
    const { eventId, phone, message } = req.body;
    if (!eventId || !phone || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    // In production, use Twilio or SMS gateway
    // await twilio.messages.create({ to: phone, from: process.env.TWILIO_NUMBER, body: message });
    await SnatchEvent.findByIdAndUpdate(eventId, { fallbackSent: true, status: 'fallback_sent' });
    res.json({ success: true, message: 'Stub: SMS sent (simulate in dev)' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Find nearest police station (stub)
exports.findNearestPoliceStation = async (req, res) => {
  try {
    const { lat, lng } = req.query;
    if (!lat || !lng) return res.status(400).json({ error: 'Missing lat/lng' });
    // In production, use Google Maps Places API
    // const response = await axios.get(...)
    // Stub: return a fake police station
    res.json({
      success: true,
      policeStation: {
        name: 'Central Police Station',
        address: '123 Main St, City',
        lat: parseFloat(lat) + 0.001,
        lng: parseFloat(lng) + 0.001
      },
      message: 'Stub: Replace with real API call'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 