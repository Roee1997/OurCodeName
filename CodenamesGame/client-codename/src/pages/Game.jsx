import { onValue, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebaseConfig";
import Board from "../components/Board";
import ClueChat from "../components/ClueChat";
import CluePanel from "../components/CluePanel";
import { useAuth } from "../context/AuthContext";
import { subscribeToClues } from "../services/firebaseService";

const Game = () => {
  const { gameId } = useParams();
  const { user, loading } = useAuth();

  const [isSpymaster, setIsSpymaster] = useState(false);
  const [team, setTeam] = useState(null);
  const [clues, setClues] = useState([]);

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

  if (loading) return <p>טוען...</p>;
  if (!user) return <p>אין גישה</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">🎮 משחק שם קוד – חדר #{gameId}</h1>

      <div className="flex gap-6">
        {/* לוח הקלפים */}
        <div className="flex-1">
          <Board gameId={gameId} user={user} />
          {isSpymaster && team && (
            <div className="mt-4">
              <CluePanel gameId={gameId} team={team} />
            </div>
          )}
        </div>

        {/* צ’אט הרמזים בצד ימין */}
        <div className="w-64">
          <ClueChat clues={clues} />
        </div>
      </div>
    </div>
  );
};

export default Game;
