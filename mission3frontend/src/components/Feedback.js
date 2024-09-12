// src/components/Feedback.js
import React, { useEffect, useState } from 'react';

function Feedback({ getFeedback }) {
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    const fetchFeedback = async () => {
      const feedbackText = await getFeedback();
      setFeedback(feedbackText);
    };
    fetchFeedback();
  }, [getFeedback]);

  return (
    <div className="feedback">
      <h2>Interview Feedback</h2>
      <p>{feedback}</p>
    </div>
  );
}

export default Feedback;
