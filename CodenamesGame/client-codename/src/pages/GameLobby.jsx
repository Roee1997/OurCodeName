import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const GameLobby = () => {
  const { gameId } = useParams(); // מזהה המשחק מה-URL
  const navigate = useNavigate();
  const { user } = useAuth();

  const [players, setPlayers] = useState([]);
  const [isCreator, setIsCreator] = useState(false);

  // שליפת השחקנים מהשרת
  useEffect(() => {
    fetchPlayers();
    checkIfCreator();
  }, []);

  const fetchPlayers = async () => {
    try {
      const response = await axios.get(`https://localhost:5150/api/games/${gameId}/players`);
      setPlayers(response.data);
    } catch (err) {
      console.error("שגיאה בקבלת שחקנים:", err);
    }
  };

  const checkIfCreator = async () => {
    try {
      const response = await axios.get(`https://localhost:port/api/games/${gameId}`);
      if (response.data.createdBy === user.uid) {
        setIsCreator(true);
      }
    } catch (err) {
      console.error("שגיאה בבדיקת יוצר המשחק:", err);
    }
  };

  const handleCopyLink = () => {
    const joinLink = `${window.location.origin}/join-game/${gameId}`;
    navigator.clipboard.writeText(joinLink);
    alert("קישור הועתק");
  };

  const handleStartGame = () => {
    // בעתיד: עדכון סטטוס המשחק ל-In Progress
    navigate(`/game/${gameId}`);
  };

  return (
    <div className="p-8 text-center max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">חדר משחק #{gameId}</h1>

      <button
        onClick={handleCopyLink}
        className="mb-6 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        העתק קישור לחדר
      </button>

      <h2 className="text-xl font-semibold mb-2">שחקנים בלובי:</h2>
      <ul className="space-y-2 mb-6">
        {players.map((player) => (
          <li key={player.userID}>
            🧑 {player.username} — קבוצה: {player.team}{" "}
            {player.isSpymaster ? "🕵️ רמזן" : ""}
          </li>
        ))}
      </ul>

      {isCreator && (
        <button
          onClick={handleStartGame}
          className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700"
        >
          התחל משחק
        </button>
      )}
    </div>
  );
};

export default GameLobby;
