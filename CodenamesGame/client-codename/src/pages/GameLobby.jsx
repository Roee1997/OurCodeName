import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const GameLobby = () => {
  const { gameId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [players, setPlayers] = useState([]);

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const response = await fetch(`http://localhost:5150/api/playeringames/${gameId}/players`);
      const data = await response.json();
      setPlayers(data);
    } catch (error) {
      console.error("שגיאה בטעינת שחקנים:", error);
    }
  };

  const joinTeam = async (team) => {
    try {
      await fetch(`http://localhost:5150/api/playeringames/${gameId}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          gameID: parseInt(gameId),
          userID: user.uid,
          team: team,
          isSpymaster: false
        })
      });
      fetchPlayers();
    } catch (error) {
      console.error("שגיאה בהצטרפות לקבוצה:", error);
    }
  };

  const becomeSpymaster = async (team) => {
    try {
      await fetch(`http://localhost:5150/api/playeringames/${gameId}/update-player`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameID: parseInt(gameId),
          userID: user.uid,
          team: team,
          isSpymaster: true
        })
      });
      fetchPlayers();
    } catch (error) {
      console.error("שגיאה בהפיכה לרמזן:", error);
    }
  };

  const changeTeam = async (newTeam) => {
    try {
      await fetch(`http://localhost:5150/api/playeringames/${gameId}/update-player`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameID: parseInt(gameId),
          userID: user.uid,
          team: newTeam,
          isSpymaster: false
        })
      });
      fetchPlayers();
    } catch (error) {
      console.error("שגיאה בהחלפת קבוצה:", error);
    }
  };

  const redTeam = players.filter(p => p.team === "Red");
  const blueTeam = players.filter(p => p.team === "Blue");

  return (
    <div className="p-6 max-w-4xl mx-auto text-center">
      <h1 className="text-3xl font-bold mb-4">חדר משחק #{gameId}</h1>

      {/* כפתורי הצטרפות */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => joinTeam("Red")}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          הצטרף לאדומים 🔴
        </button>
        <button
          onClick={() => joinTeam("Blue")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          הצטרף לכחולים 🔵
        </button>
      </div>

      {/* הצגת הקבוצות */}
      <div className="flex justify-around gap-8">
        {/* אדומים */}
        <div className="flex-1">
          <h2 className="text-xl font-bold text-red-600 mb-2">קבוצה אדומה 🔴</h2>
          <ul className="space-y-2">
            {redTeam.map(player => (
              <li key={player.userID}>
                {player.userID === user.uid ? (
                  <>
                    <span className="font-bold text-green-800">
                      {user.displayName || "אתה"}
                    </span>
                    {player.isSpymaster && " 🕵️"}
                    <button
                      onClick={() => changeTeam("Blue")}
                      className="ml-2 text-sm text-yellow-600 underline"
                    >
                      החלף לקבוצה 🔵
                    </button>
                    <button
                      onClick={() => becomeSpymaster("Red")}
                      className="ml-2 text-sm text-blue-500 underline"
                    >
                      הפוך לרמזן
                    </button>
                  </>
                ) : (
                  <>
                    {`שחקן (${player.userID.slice(0, 5)}...)`}
                    {player.isSpymaster && " 🕵️"}
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* כחולים */}
        <div className="flex-1">
          <h2 className="text-xl font-bold text-blue-600 mb-2">קבוצה כחולה 🔵</h2>
          <ul className="space-y-2">
            {blueTeam.map(player => (
              <li key={player.userID}>
                {player.userID === user.uid ? (
                  <>
                    <span className="font-bold text-green-800">
                      {user.displayName || "אתה"}
                    </span>
                    {player.isSpymaster && " 🕵️"}
                    <button
                      onClick={() => changeTeam("Red")}
                      className="ml-2 text-sm text-yellow-600 underline"
                    >
                      החלף לקבוצה 🔴
                    </button>
                    <button
                      onClick={() => becomeSpymaster("Blue")}
                      className="ml-2 text-sm text-blue-500 underline"
                    >
                      הפוך לרמזן
                    </button>
                  </>
                ) : (
                  <>
                    {`שחקן (${player.userID.slice(0, 5)}...)`}
                    {player.isSpymaster && " 🕵️"}
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GameLobby;

