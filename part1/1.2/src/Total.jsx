// Total.jsx
import React from 'react';

const Total = ({ exercises }) => {
  const totalExercises = exercises.reduce((sum, part) => sum + part, 0);

  return (
    <p>Number of exercises {totalExercises}</p>
  );
};

export default Total;
