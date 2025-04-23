import { onValue, ref, set } from "firebase/database"; // נוודא שהשירות הזה קיים
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../firebaseConfig"; // נוודא  הזה קיים
import { useAuth } from "../context/AuthContext";
import { saveBoardToFirebase, savePlayerToLobby, setTurn, subscribeToLobbyPlayers } from "../services/firebaseService";


const GameLobby = () => {
  const { gameId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [players, setPlayers] = useState([]);

  // האזנה ל־Firebase בזמן אמת
  useEffect(() => {
    const unsubscribePlayers = subscribeToLobbyPlayers(gameId, setPlayers);
  
    const statusRef = ref(db, `lobbies/${gameId}/status`);
    const unsubscribeStatus = onValue(statusRef, (snapshot) => {
      console.log("✅ onValue is working:", typeof onValue);
      const status = snapshot.val();
      if (status === "started") {
        navigate(`/game/${gameId}`);
        return; // אם המשחק התחיל, נוודא שלא נבצע עדכון נוסף
      }
    });
  
    return () => {
      unsubscribePlayers();
      unsubscribeStatus(); // נקה את שתי ההאזנות
    };
  }, [gameId]);
  

  // ✅ שלב חדש: הצטרפות למשחק אם צריך ואז עדכון
  const joinGameIfNeeded = async (team, isSpymaster = false) => {
    try {
      const playerExists = players.some(p => p.userID === user.uid);
      if (!playerExists) {
        const joinRes = await fetch(`http://localhost:5150/api/playeringames/${gameId}/join`, {
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

        if (!joinRes.ok) {
          let errorMsg = "שגיאה בהצטרפות למשחק";
          try {
            const contentType = joinRes.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
              const err = await joinRes.json();
              errorMsg = err.error || errorMsg;
            } else {
              const text = await joinRes.text();
              errorMsg = `שגיאה מהשרת: ${text}`;
            }
          } catch (e) {
            errorMsg = "שגיאה לא צפויה בהצטרפות";
          }

          console.error(errorMsg);
          return;
        }
      }

      // תמיד נבצע עדכון סטטוס של הקבוצה / לוחש
      await updatePlayer(team, isSpymaster);
    } catch (error) {
      console.error("שגיאה ב־joinGameIfNeeded:", error);
    }
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
  
    try {
      const res = await fetch(`http://localhost:5150/api/games/${gameId}/start`, {
        method: "POST"
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        alert(data?.message || "שגיאה בהתחלת המשחק");
        return;
      }

      // ✅ שלב חדש: שמור את הקלפים ל־Realtime Database
      await saveBoardToFirebase(gameId, data.board);
      // ✅ הגרלת תור ראשון רנדומלי ושמירה ל־Firebase
      const randomTeam = Math.random() < 0.5 ? "Red" : "Blue";
      await setTurn(gameId, randomTeam);

      // ✅ עדכון ב־Firebase כדי שכולם יעברו למסך המשחק
      await set(ref(db, `lobbies/${gameId}/status`), "started");
  
      // ✅ ניווט מקומי
      navigate(`/game/${gameId}`);
    } catch (err) {
      console.error("שגיאה בהתחלת המשחק", err);
      alert("שגיאה בהתחלת המשחק");
    }
  };
  
  const redTeam = players.filter(p => p.team === "Red");
  const blueTeam = players.filter(p => p.team === "Blue");

  return (
    <div className="p-6 max-w-4xl mx-auto text-center">
      <h1 className="text-3xl font-bold mb-4">חדר משחק #{gameId}</h1>

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
