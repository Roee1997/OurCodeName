// src/components/ClueChat.jsx
import React from "react";

const ClueChat = ({ clues }) => {
  return (
    <div
    className="rounded shadow-inner text-right bg-white"
    style={{
      height: "100%",
      padding: "1rem",
      overflowY: "auto",
      border: "1px solid #ddd",
      minWidth: "20rem", // ⬅️ היה 16rem → עכשיו 20rem
      maxWidth: "24rem"  // גבול עליון שלא יתפוצץ
      }}
    >
      <h3 className="text-lg font-bold mb-2">💬 רמזים</h3>
      {clues.length === 0 ? (
        <p className="text-gray-500">אין רמזים עדיין...</p>
      ) : (
        <ul className="space-y-1">
          {clues.map((clue, index) => (
            <li key={clue.timestamp || index}>
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
