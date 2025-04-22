import React, { useState } from "react";
import { sendClueToFirebase } from "../services/firebaseService";

const CluePanel = ({ team, gameId }) => {
  const [word, setWord] = useState("");
  const [number, setNumber] = useState("");

  const handleSend = async () => {
    if (!word || !number) return;
    const clue = {
      word: word.trim(),
      number: parseInt(number),
      team,
      timestamp: Date.now(),
    };
    await sendClueToFirebase(gameId, clue);
    setWord("");
    setNumber("");
  };

  return (
    <div className="p-4 bg-gray-100 rounded shadow-md text-center">
      <h3 className="font-bold mb-2">
        🕵️ תן רמז לקבוצה {team === "Red" ? "האדומה 🔴" : "הכחולה 🔵"}
      </h3>
      <div className="flex justify-center gap-2">
        <input
          type="text"
          placeholder="מילה"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          className="border px-2 py-1 rounded w-1/2"
        />
        <input
          type="number"
          placeholder="מספר"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          className="border px-2 py-1 rounded w-1/4"
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
        >
          שלח רמז
        </button>
      </div>
    </div>
  );
};

export default CluePanel;
