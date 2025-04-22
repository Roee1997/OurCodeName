// src/components/ClueChat.jsx
import React from "react";

const ClueChat = ({ clues }) => {
  return (
    <div className="bg-white p-4 mt-4 rounded shadow-inner max-h-60 overflow-y-auto text-right">
      <h3 className="text-lg font-bold mb-2">💬 רמזים</h3>
      {clues.length === 0 ? (
        <p className="text-gray-500">אין רמזים עדיין...</p>
      ) : (
        <ul className="space-y-1">
        {clues.map((clue, index) => (
        <li key={clue.timestamp || index}>  {/* עדיף לשלב גם את ה־timestamp */}
            <span className={clue.team === "Red" ? "text-red-600" : "text-blue-600"}>
            {clue.team === "Red" ? "🟥 לוחש אדום" : "🟦 לוחש כחול"}
            </span>{" "}
            רמז: <strong>{clue.word}</strong> – {clue.number}
        </li>
        ))}
        </ul>
      )}
    </div>
  );
};

export default ClueChat;
