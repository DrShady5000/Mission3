import express from 'express';
import { startInterview, nextQuestion, getFeedback } from '../controllers/interviewController.js';

const router = express.Router();

// Define routes
router.post('/start', startInterview);     // Start the interview
router.post('/next', nextQuestion);        // Handle next question
router.get('/feedback', getFeedback);      // Get feedback at the end

export default router; // Use default export
