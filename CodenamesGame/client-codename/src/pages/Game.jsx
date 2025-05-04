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
  setUserOnlineStatus,
  subscribeToLobbyPlayers,
} from "../services/firebaseService";

import Header from "../components/Header";
import Footer from "../components/Footer";
import BackgroundImage from "../components/BackgroundImage";
import codenamesImage from "../assets/codename.webp";

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
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    if (!gameId || !user?.uid) return;
    setUserOnlineStatus(user.uid, true, gameId);

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
            await setGameEnded(gameId);
          }
        }, 1000);
      }
    });

    return () => unsubscribe();
  }, [gameId]);

  useEffect(() => {
    if (!gameId) return;
    const unsubscribe = subscribeToGameEnded(gameId, (ended) => {
      if (ended) navigate("/lobby");
    });
    return () => unsubscribe();
  }, [gameId]);

  useEffect(() => {
    if (!gameId) return;
    const unsubscribe = subscribeToLobbyPlayers(gameId, setPlayers);
    return () => unsubscribe();
  }, [gameId]);

  if (loading) return <p className="text-center text-white mt-20">⏳ טוען משתמש...</p>;
  if (!user) return <p className="text-center text-red-500 mt-20">😢 אין גישה</p>;

  const redTeam = players.filter((p) => p.team === "Red");
  const blueTeam = players.filter((p) => p.team === "Blue");

  return (
    <div className="relative min-h-screen flex flex-col">
      <Header />
      <BackgroundImage image={codenamesImage} />

      <main className="relative z-10 container mx-auto p-6 text-white" dir="rtl">
        <section className="bg-white bg-opacity-90 p-6 rounded shadow text-black">
          <h1 className="text-3xl font-bold text-center mb-4">
            🎮 משחק שם קוד – חדר #{gameId}
          </h1>

          {currentTurn && (
            <div className="text-center text-xl font-semibold mb-4">
              🎯 תור הקבוצה {currentTurn === "Red" ? "האדומה 🔴" : "הכחולה 🔵"}
            </div>
          )}

          {winner && (
            <div className="text-center text-2xl font-bold bg-green-100 text-green-700 p-4 rounded mb-4 shadow">
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

          {/* 👥 הצגת שחקנים */}
          <div className="flex justify-around gap-8 mb-6">
            {["Red", "Blue"].map((teamColor) => {
              const teamPlayers = players.filter((p) => p.team === teamColor);
              return (
                <div
                  key={teamColor}
                  className="flex-1 bg-white/80 p-4 rounded text-black shadow"
                >
                  <h2
                    className={`text-xl font-bold mb-2 ${
                      teamColor === "Red" ? "text-red-600" : "text-blue-600"
                    }`}
                  >
                    קבוצה {teamColor === "Red" ? "אדומה" : "כחולה"}
                  </h2>
                  <ul className="space-y-2">
                    {teamPlayers.map((player) => (
                      <li key={player.userID}>
                        <span
                          className={
                            player.userID === user.uid
                              ? "font-bold text-green-800"
                              : ""
                          }
                        >
                          {player.username || `שחקן (${player.userID.slice(0, 5)}...)`}
                        </span>
                        {player.isSpymaster && " 🕵️"}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 lg:pr-6">
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
                  <CluePanel
                    gameId={gameId}
                    team={team}
                    currentTurn={currentTurn}
                  />
                </div>
              )}
            </div>

            <div className="w-full lg:w-[20rem] xl:w-[24rem] lg:pl-4">
              <ClueChat clues={clues} />
            </div>
          </div>
        </section>
      </main>

      <Footer className="mt-auto" />
    </div>
  );
};

export default Game;
