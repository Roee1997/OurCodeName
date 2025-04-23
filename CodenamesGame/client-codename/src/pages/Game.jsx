import { onValue, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebaseConfig";
import Board from "../components/Board";
import ClueChat from "../components/ClueChat";
import CluePanel from "../components/CluePanel";
import { useAuth } from "../context/AuthContext";
import { subscribeToClues, subscribeToTurn, subscribeToWinner } from "../services/firebaseService"; // ✅

const Game = () => {
  const { gameId } = useParams();
  const { user, loading } = useAuth();

  const [isSpymaster, setIsSpymaster] = useState(false);
  const [team, setTeam] = useState(null);
  const [clues, setClues] = useState([]);
  const [currentTurn, setCurrentTurn] = useState(null);
  const [winner, setWinner] = useState(null); // ✅

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

  // ✅ האזנה לזוכה
  useEffect(() => {
    if (!gameId) return;
    const unsubscribe = subscribeToWinner(gameId, setWinner);
    return () => unsubscribe();
  }, [gameId]);

  if (loading) return <p>טוען...</p>;
  if (!user) return <p>אין גישה</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">🎮 משחק שם קוד – חדר #{gameId}</h1>

      {/* 🎯 תור נוכחי */}
      {currentTurn && (
        <div className="text-center text-xl font-semibold mb-4">
          🎯 תור הקבוצה {currentTurn === "Red" ? "האדומה 🔴" : "הכחולה 🔵"}
        </div>
      )}

      {/* 🏆 הודעת ניצחון / הפסד */}
      {winner && (
        <div className="text-center text-2xl font-bold bg-white p-4 rounded shadow-lg text-green-700 mb-4">
          {winner === "Red" && "🏆 הקבוצה האדומה ניצחה!"}
          {winner === "Blue" && "🏆 הקבוצה הכחולה ניצחה!"}
          {winner === "RedLost" && "💀 הקבוצה האדומה הפסידה – נלחץ מתנקש!"}
          {winner === "BlueLost" && "💀 הקבוצה הכחולה הפסידה – נלחץ מתנקש!"}
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
            winner={winner} // ✅ שולח ל־Board.jsx
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
