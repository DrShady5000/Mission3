// src/components/QuestionAnswer.js
import React, { useState } from 'react';

function QuestionAnswer({ question, onNext }) {
  const [answer, setAnswer] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (answer.trim()) {
      onNext(answer);
      setAnswer('');
    }
  };

  return (
    <div className="question-answer">
      <h2>Interview Question</h2>
      <p>{question}</p>
      <form onSubmit={handleSubmit}>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer here"
        />
        <button type="submit">Next Question</button>
      </form>
    </div>
  );
}

export default QuestionAnswer;
