import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { savePlayerToLobby, subscribeToLobbyPlayers } from "../services/firebaseService";

const GameLobby = () => {
  const { gameId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [players, setPlayers] = useState([]);

  // האזנה ל־Firebase בזמן אמת
  useEffect(() => {
    const unsubscribe = subscribeToLobbyPlayers(gameId, setPlayers);
    return () => unsubscribe();
  }, [gameId]);

  // ✅ שלב חדש: הצטרפות למשחק אם צריך ואז עדכון
  const joinGameIfNeeded = async (team, isSpymaster = false) => {
    const alreadyInGame = players.some(p => p.userID === user.uid);

    if (!alreadyInGame) {
      await fetch(`http://localhost:5150/api/playeringames/${gameId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameID: parseInt(gameId),
          userID: user.uid,
          username: user.displayName || "ללא שם",
          team,
          isSpymaster
        })
      });
    }

    await updatePlayer(team, isSpymaster);
  };

  const updatePlayer = async (team, isSpymaster) => {
    try {
      await fetch(`http://localhost:5150/api/playeringames/${gameId}/update-player`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameID: parseInt(gameId),
          userID: user.uid,
          username: user.displayName || "ללא שם",
          team,
          isSpymaster
        })
      });

      // שמירה ב-Firebase
      await savePlayerToLobby(gameId, {
        userID: user.uid,
        username: user.displayName || "ללא שם",
        team,
        isSpymaster
      });
    } catch (error) {
      console.error("שגיאה בעדכון שחקן:", error);
    }
  };

  const toggleSpymaster = (team) => {
    const player = players.find(p => p.userID === user.uid);
    if (!player || player.team !== team) return;

    const alreadySpymaster = player.isSpymaster;
    if (!alreadySpymaster) {
      const teamSpymaster = players.find(p => p.team === team && p.isSpymaster);
      if (teamSpymaster) {
        alert("כבר יש לוחש בקבוצה הזו");
        return;
      }
    }

    updatePlayer(team, !alreadySpymaster);
  };

  const checkIfReady = async () => {
    try {
      const res = await fetch(`http://localhost:5150/api/playeringames/${gameId}/is-ready`);
      const data = await res.json();
      return data.isReady;
    } catch (err) {
      console.error("שגיאה בבדיקת מוכנות המשחק", err);
      return false;
    }
  };

  const startGame = async () => {
    const ready = await checkIfReady();
    if (!ready) {
      alert("המשחק עדיין לא מוכן – חייב לוחש וסוכן בכל קבוצה");
      return;
    }

    await fetch(`http://localhost:5150/api/games/${gameId}/start`, {
      method: "POST"
    });

    navigate(`/game/${gameId}`);
  };

  const redTeam = players.filter(p => p.team === "Red");
  const blueTeam = players.filter(p => p.team === "Blue");

  return (
    <div className="p-6 max-w-4xl mx-auto text-center">
      <h1 className="text-3xl font-bold mb-4">חדר משחק #{gameId}</h1>

      {/* כפתורי הצטרפות */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => joinGameIfNeeded("Red", false)}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          הצטרף לאדומים 🔴
        </button>
        <button
          onClick={() => joinGameIfNeeded("Blue", false)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          הצטרף לכחולים 🔵
        </button>
      </div>

      {/* הצגת הקבוצות */}
      <div className="flex justify-around gap-8">
        {["Red", "Blue"].map((teamColor) => {
          const teamPlayers = players.filter(p => p.team === teamColor);

          return (
            <div key={teamColor} className="flex-1">
              <h2 className={`text-xl font-bold mb-2 ${teamColor === "Red" ? "text-red-600" : "text-blue-600"}`}>
                קבוצה {teamColor === "Red" ? "אדומה 🔴" : "כחולה 🔵"}
              </h2>
              <ul className="space-y-2">
                {teamPlayers.map(player => (
                  <li key={player.userID}>
                    {player.userID === user.uid ? (
                      <>
                        <span className="font-bold text-green-800">
                          {player.username || "אתה"}
                        </span>
                        {player.isSpymaster && " 🕵️"}
                        <button
                          onClick={() => joinGameIfNeeded(teamColor === "Red" ? "Blue" : "Red", false)}
                          className="ml-2 text-sm text-yellow-600 underline"
                        >
                          החלף קבוצה
                        </button>
                        <button
                          onClick={() => toggleSpymaster(teamColor)}
                          className="ml-2 text-sm text-blue-500 underline"
                        >
                          {player.isSpymaster ? "הפוך לסוכן" : "הפוך ללוחש"}
                        </button>
                      </>
                    ) : (
                      <>
                        {player.username || `שחקן (${player.userID.slice(0, 5)}...)`}
                        {player.isSpymaster && " 🕵️"}
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* כפתור התחלת משחק */}
      <div className="mt-8">
        <button
          onClick={startGame}
          className="px-6 py-2 bg-green-600 text-white font-bold rounded hover:bg-green-700"
        >
          🎮 התחל משחק
        </button>
      </div>
    </div>
  );
};

export default GameLobby;
