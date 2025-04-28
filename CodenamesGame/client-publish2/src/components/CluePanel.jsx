import React, { useEffect, useState } from "react";
import { sendClueToFirebase, setLastClue, subscribeToLastClue } from "../services/firebaseService";

const CluePanel = ({ team, gameId, currentTurn }) => {
  const [word, setWord] = useState("");
  const [number, setNumber] = useState("");
  const [lastClue, setLastClueState] = useState(null);

  useEffect(() => {
    if (!gameId) return;
    const unsubscribe = subscribeToLastClue(gameId, setLastClueState);
    return () => unsubscribe();
  }, [gameId]);

  const handleSend = async () => {
    if (!word || !number) return;
    const clue = {
      word: word.trim(),
      number: parseInt(number),
      team,
      timestamp: Date.now(),
    };

    await sendClueToFirebase(gameId, clue);
    await setLastClue(gameId, clue);

    setWord("");
    setNumber("");
  };

  if (team !== currentTurn) {
    return (
      <div className="text-center mt-2 text-gray-600 font-medium">
        ⏳ ממתין לתור הקבוצה שלך...
      </div>
    );
  }

  if (lastClue && lastClue.team === team) {
    return (
      <div className="text-center mt-2 text-gray-600 font-medium">
        🕵️ שלחת רמז – ממתין לסיום התור...
      </div>
    );
  }

  return (
    <div
      className="p-4 bg-gray-100 rounded shadow-md text-center"
      style={{ maxWidth: "450px", margin: "0 auto" }} // ⬅️ צר יותר
    >
      <h3 className="text-gray-600 font-bold mb-2">
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
        <select
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          className="border px-2 py-1 rounded w-1/4"
        >
          <option value="">בחר</option>
          {[...Array(8)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
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
