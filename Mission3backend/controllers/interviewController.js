// controllers/interviewController.js

import fetch from 'node-fetch'; // Use import for ES Modules

// Mock data for interview context (you can use a more robust state management solution)
let interviewContext = [];

// Helper function to interact with Google Gemini API
const callGeminiAPI = async (prompt) => {
  const apiEndpoint = 'https://gemini.googleapis.com/v1/generate'; // Replace with actual Gemini API endpoint
  const apiKey = 'YOUR_API_KEY'; // Replace with your actual API key

  const response = await fetch(apiEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.response; // Adjust according to the actual API response format
};

// Controller for starting the interview
const startInterview = async (req, res) => {
  const { role } = req.body;
  const initialPrompt = "Tell me about yourself.";

  // Store the initial context
  interviewContext.push({ role, questions: [initialPrompt], answers: [] });

  try {
    const initialQuestion = await callGeminiAPI(initialPrompt);
    res.json({ question: initialQuestion });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate question' });
  }
};

// Controller for handling the next question
const nextQuestion = async (req, res) => {
  const { answer } = req.body;

  // Add the user's answer to the context
  interviewContext[0].answers.push(answer);

  const followUpPrompt = "Can you tell me about a time when you faced a challenge at work?";

  try {
    const followUpQuestion = await callGeminiAPI(followUpPrompt);
    interviewContext[0].questions.push(followUpQuestion);
    res.json({ question: followUpQuestion });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate question' });
  }
};

// Controller for providing feedback
const getFeedback = async (req, res) => {
  try {
    // Generate feedback using Gemini API
    const feedbackPrompt = "Provide feedback on the following answers: " + interviewContext[0].answers.join(', ');
    const feedback = await callGeminiAPI(feedbackPrompt);

    res.json({ feedback });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate feedback' });
  }
};

export {
  startInterview,
  nextQuestion,
  getFeedback,
};
