import React from "react";
import { useParams } from "react-router-dom";
import Board from "../components/Board";
import { useAuth } from "../context/AuthContext";

const Game = () => {
  const { gameId } = useParams();
  const { user } = useAuth();

  return (
    <div>
      <h1>משחק שם קוד</h1>
      <Board gameId={gameId} user={user} />
    </div>
  );
};

export default Game;
