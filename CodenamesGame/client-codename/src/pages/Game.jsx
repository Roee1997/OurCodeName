import { onValue, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../firebaseConfig";
import Board from "../components/Board";
import ClueChat from "../components/ClueChat";
import CluePanel from "../components/CluePanel";
import { useAuth } from "../context/AuthContext";
import {
  setGameEnded,
  subscribeToClues,
  subscribeToGameEnded,
  subscribeToTurn,
  subscribeToWinner,
} from "../services/firebaseService";

const Game = () => {
  const { gameId } = useParams();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [isSpymaster, setIsSpymaster] = useState(false);
  const [team, setTeam] = useState(null);
  const [clues, setClues] = useState([]);
  const [currentTurn, setCurrentTurn] = useState(null);
  const [winner, setWinner] = useState(null);
  const [redirectCountdown, setRedirectCountdown] = useState(null);

  useEffect(() => {
    if (!gameId || !user?.uid) return;

    const playerRef = ref(db, `lobbies/${gameId}/players/${user.uid}`);
    return onValue(playerRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setTeam(data.team);
        setIsSpymaster(data.isSpymaster);
      }
    });
  }, [gameId, user?.uid]);

  useEffect(() => {
    if (!gameId) return;
    const unsubscribe = subscribeToClues(gameId, setClues);
    return () => unsubscribe();
  }, [gameId]);

  useEffect(() => {
    if (!gameId) return;
    const unsubscribe = subscribeToTurn(gameId, setCurrentTurn);
    return () => unsubscribe();
  }, [gameId]);

  useEffect(() => {
    if (!gameId) return;

    const unsubscribe = subscribeToWinner(gameId, (winValue) => {
      setWinner(winValue);

      if (winValue) {
        let countdown = 10;
        setRedirectCountdown(countdown);

        const interval = setInterval(async () => {
          countdown--;
          setRedirectCountdown(countdown);

          if (countdown === 0) {
            clearInterval(interval);
            await setGameEnded(gameId); // 🔁 כל המשתמשים מאזינים
          }
        }, 1000);
      }
    });

    return () => unsubscribe();
  }, [gameId]);

  // האזנה למעבר לובי
  useEffect(() => {
    if (!gameId) return;
    const unsubscribe = subscribeToGameEnded(gameId, (ended) => {
      if (ended) {
        navigate("/lobby");
      }
    });
    return () => unsubscribe();
  }, [gameId]);

  if (loading) return <p>טוען...</p>;
  if (!user) return <p>אין גישה</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">🎮 משחק שם קוד – חדר #{gameId}</h1>

      {currentTurn && (
        <div className="text-center text-xl font-semibold mb-4">
          🎯 תור הקבוצה {currentTurn === "Red" ? "האדומה 🔴" : "הכחולה 🔵"}
        </div>
      )}

      {winner && (
        <div className="text-center text-2xl font-bold bg-white p-4 rounded shadow-lg text-green-700 mb-4">
          {winner === "Red" && "🏆 הקבוצה האדומה ניצחה!"}
          {winner === "Blue" && "🏆 הקבוצה הכחולה ניצחה!"}
          {winner === "RedLost" && "💀 הקבוצה האדומה הפסידה – נלחץ מתנקש!"}
          {winner === "BlueLost" && "💀 הקבוצה הכחולה הפסידה – נלחץ מתנקש!"}
          {redirectCountdown !== null && (
            <div className="text-sm text-gray-600 mt-2">
              מעבר ללובי בעוד {redirectCountdown} שניות...
            </div>
          )}
        </div>
      )}

      <div className="flex gap-6">
        <div className="flex-1">
          <Board
            gameId={gameId}
            user={user}
            team={team}
            isSpymaster={isSpymaster}
            currentTurn={currentTurn}
            winner={winner}
          />
          {isSpymaster && team && (
            <div className="mt-4">
              <CluePanel gameId={gameId} team={team} currentTurn={currentTurn} />
            </div>
          )}
        </div>

        <div className="w-64">
          <ClueChat clues={clues} />
        </div>
      </div>
    </div>
  );
};

export default Game;
