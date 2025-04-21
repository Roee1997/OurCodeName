import React from "react";
import { useParams } from "react-router-dom";
import Board from "../components/Board";
import { useAuth } from "../context/AuthContext";

const Game = () => {
  const { gameId } = useParams();
  const { user, loading } = useAuth();

  if (loading) return <p className="text-center">⏳ טוען משתמש...</p>;
  if (!user) return <p className="text-center text-red-500">😢 אין גישה – אנא התחבר</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto text-center">
      <h1 className="text-3xl font-bold mb-4">🎮 משחק שם קוד – חדר #{gameId}</h1>
      <Board gameId={gameId} user={user} />
    </div>
  );
};

export default Game;
