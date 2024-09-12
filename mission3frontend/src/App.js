import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [jobTitle, setJobTitle] = useState('');
  const [userResponse, setUserResponse] = useState('');
  const [question, setQuestion] = useState('');
  const [feedback, setFeedback] = useState('');
  const [userId] = useState(Date.now().toString()); // Simple unique ID based on timestamp

  const handleJobTitleChange = (e) => setJobTitle(e.target.value);
  const handleUserResponseChange = (e) => setUserResponse(e.target.value);

  const startInterview = async () => {
    if (!jobTitle) {
      alert('Please enter a job title.');
      return;
    }

    try {
      console.log('Starting interview with job title as user response:', { jobTitle, userResponse: jobTitle, userId });
      // Send jobTitle as both jobTitle and userResponse for the initial request
      const response = await axios.post('http://localhost:5000/api/interview', {
        jobTitle,
        userResponse: jobTitle, // Use job title as the initial user response
        userId,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Response from backend:', response.data);
      const { answer } = response.data; // Expecting the first question from the backend
      setQuestion(answer);
      setUserResponse(''); // Clear the input field
    } catch (error) {
      console.error('Error communicating with the backend:', error.response || error.message);
    }
  };

  const handleSubmit = async () => {
    // Trim whitespace and check if the response is empty
    if (!userResponse.trim()) {
      alert('Please enter a valid response.');
      return;
    }

    try {
      console.log('Sending user response to backend:', { jobTitle, userResponse, userId });
      const response = await axios.post('http://localhost:5000/api/interview', {
        jobTitle,
        userResponse,
        userId,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Response from backend:', response.data);
      const { answer, feedback } = response.data; // Update question and feedback based on backend response
      setQuestion(answer); 
      setFeedback(feedback); 
      setUserResponse(''); // Clear the input field
    } catch (error) {
      console.error('Error communicating with the backend:', error.response || error.message);
    }
  };

  return (
    <div className="App">
      <h1>Job Interview Simulator</h1>

      <div className="input-section">
        <label htmlFor="jobTitle">Enter Job Title:</label>
        <input
          type="text"
          id="jobTitle"
          value={jobTitle}
          onChange={handleJobTitleChange}
        />
        <button onClick={startInterview}>Start Interview</button>
      </div>

      {question && (
        <div className="interview-section">
          <h2>Interview Question:</h2>
          <p>{question}</p>

          <textarea
            placeholder="Your response..."
            value={userResponse}
            onChange={handleUserResponseChange}
          />
          <button onClick={handleSubmit}>Submit Response</button>
        </div>
      )}

      {feedback && (
        <div className="feedback-section">
          <h2>Feedback:</h2>
          <p>{feedback}</p>
        </div>
      )}
    </div>
  );
}

export default App;
