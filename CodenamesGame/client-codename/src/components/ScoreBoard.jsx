import React from "react";

const ScoreBoard = ({ score }) => {
  return (
    <div className="flex justify-around w-full max-w-md p-4 bg-gray-100 rounded-lg shadow-md">
      <div className="text-red-600 font-bold text-lg">Red Team: {score.red}</div>
      <div className="text-blue-600 font-bold text-lg">Blue Team: {score.blue}</div>
    </div>
  );
};

export default ScoreBoard;
