const FakeCall = require('../model/fake-call');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini API
const API_KEY = process.env.GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY'; // Replace with your actual API key or load from environment variables
const genAI = new GoogleGenerativeAI(API_KEY);

const saveFakeCall = async (req, res) => {
    const { phone, name } = req.body;
    const userId = req.params.id;
    const fakeCall = new FakeCall({ phone, name, userId });
    try {
        await fakeCall.save();
        res.status(201).json({ message: 'Fake call saved' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getFakeCalls = async (req, res) => {
    try {
        const userId = req.params.id; // Fixed: correctly get userId from params
        const fakeCalls = await FakeCall.find({ userId: userId }); // Added userId in query
        res.json(fakeCalls);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const chatbotChat = async (req, res) => {
    const { message } = req.body;
    
    try {
        // Get the Gemini model
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        
        // Setup the chat context
        const chatContext = `You are a helpful assistant for a safety app called "I'M SAFE". 
        Your primary goal is to provide safety advice, emergency guidance, and general help 
        to users who might be in uncomfortable or dangerous situations. Keep responses brief, 
        helpful, and compassionate. If someone is in immediate danger, always advise them to 
        call emergency services (911 or local equivalent) immediately.`;
        
        // Generate a response from Gemini
        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: "What's your purpose?" }],
                },
                {
                    role: "model",
                    parts: [{ text: "I'm your safety assistant in the I'M SAFE app. I can provide safety advice, emergency guidance, and help in uncomfortable situations. How can I assist you today?" }],
                }
            ],
            generationConfig: {
                maxOutputTokens: 200,
                temperature: 0.7,
            },
        });
        
        const result = await chat.sendMessage(message);
        const response = result.response.text();
        
        res.json({ response });
    } catch (error) {
        console.error('Error with Gemini API:', error);
        res.status(500).json({ 
            response: "I'm sorry, I'm having trouble processing your request right now. If you're in danger, please contact emergency services immediately." 
        });
    }
};

module.exports = { saveFakeCall, getFakeCalls, chatbotChat };