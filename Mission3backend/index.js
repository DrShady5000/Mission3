const express = require('express');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from your frontend
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json());

// Retrieve API key from environment variables
const API_KEY = process.env.GOOGLE_API_KEY;

// Initialize GoogleGenerativeAI client
const genAI = new GoogleGenerativeAI(API_KEY);

let conversationContext = {}; // To store conversation state

app.post('/api/interview', async (req, res) => {
  const { jobTitle, userResponse, userId } = req.body;

  // Initialize conversation context for a new user
  if (!conversationContext[userId]) {
    conversationContext[userId] = {
      context: `
      You are a job interviewer conducting an interview for the role of ${jobTitle}. The interview starts with the following introductory question: "Tell me about yourself."
      
      For the subsequent questions, consider the user's previous responses and ask relevant follow-up questions to assess their suitability for the role. At the end of the interview, provide constructive feedback on how well the user answered the questions and suggest areas for improvement.
      `,
      lastQuestion: null, // Track the last question asked
      questionCount: 0 // Track the number of questions asked
    };
  }

  // Update the context with the user's response
  conversationContext[userId].context += `
  User's previous response: "${userResponse}"
  `;

  // Check if the maximum number of questions has been reached
  if (conversationContext[userId].questionCount >= 5) {
    return res.json({ answer: "Thank you for participating in the interview. The interview is now complete." });
  }

  const prompt = conversationContext[userId].context;

  try {
    // Get the generative model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Generate content
    const response = await model.generateContent(prompt);

    // Extract only the first question from the response
    const responseText = response.response.text();
    const questions = responseText.split('*').map(q => q.trim()).filter(q => q.startsWith('**'));
    const questionToAsk = questions.length > 0 ? questions[0].replace(/^\*\*\s*/, '') : responseText;

    // Update context with AI's response
    conversationContext[userId].context += `
    AI's response: "${responseText}"
    `;
    
    // Update the last question
    conversationContext[userId].lastQuestion = questionToAsk;
    conversationContext[userId].questionCount += 1; // Increment question count

    // Send the response back to the client
    res.json({ answer: questionToAsk });
  } catch (error) {
    console.error('Error communicating with AI service:', error);
    res.status(500).json({ error: 'Error communicating with AI service', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
