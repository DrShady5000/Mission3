const express = require('express');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = 5000;

app.use(express.json());

// Retrieve API key from environment variables
const API_KEY = process.env.GOOGLE_API_KEY;

// Initialize GoogleGenerativeAI client
const genAI = new GoogleGenerativeAI(API_KEY);

let conversationContext = {}; // To store conversation state

app.post('/api/interview', async (req, res) => {
  const { jobTitle, userResponse, userId } = req.body;

  // Validate input
  if (!jobTitle || !userResponse || !userId) {
    return res.status(400).json({ error: 'Job title, user response, and user ID are required' });
  }

  // Initialize conversation context for a new user
  if (!conversationContext[userId]) {
    conversationContext[userId] = {
      context: `
      You are a job interviewer conducting an interview for the role of ${jobTitle}. The interview starts with the following introductory question: "Tell me about yourself."
      
      For the subsequent questions, consider the user's previous responses and ask relevant follow-up questions to assess their suitability for the role. At the end of the interview, provide constructive feedback on how well the user answered the questions and suggest areas for improvement.
      `
    };
  }

  // Update the context with the user's response
  conversationContext[userId].context += `
  User's previous response: "${userResponse}"
  `;

  const prompt = conversationContext[userId].context;

  try {
    // Get the generative model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Generate content
    const response = await model.generateContent(prompt);
    
    // Update context with AI's response
    conversationContext[userId].context += `
    AI's response: "${response.response.text()}"
    `;

    // Send the response back to the client
    res.json({ answer: response.response.text() });
  } catch (error) {
    console.error('Error communicating with AI service:', error);
    res.status(500).send('Error communicating with AI service');
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
