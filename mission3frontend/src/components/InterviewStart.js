// src/components/InterviewStart.js
import React, { useState } from 'react';

function InterviewStart({ onStart }) {
  const [role, setRole] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (role.trim()) {
      onStart(role);
    }
  };

  return (
    <div className="interview-start">
      <h2>Start the Interview</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="Enter the job role"
        />
        <button type="submit">Start Interview</button>
      </form>
    </div>
  );
}

export default InterviewStart;
