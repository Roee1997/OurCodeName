import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import BackgroundImage from "../components/BackgroundImage";
import MainHeadLine from "../components/MainHeadLine";
import Header from "../components/Header";
import Footer from "../components/Footer";
import codenamesImage from '../assets/codename.png';

const Lobby = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [gameIdInput, setGameIdInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  if (!user) {
    return <p>יש להתחבר כדי לגשת לדף זה.</p>;
  }

  const handleCreateGame = async () => {
    try {
      const gamePayload = {
        CreatedBy: user.uid,
        Status: "Waiting",
        CreationDate: null,
        WinningTeam: null,
        GameID: null
      };

      const response = await fetch("https://194.90.158.74/cgroup81/test2/tar1/api/games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(gamePayload)
      });

      if (!response.ok) throw new Error("שגיאה ביצירת המשחק");
      const data = await response.json();
      navigate(`/game-lobby/${data.gameID}`);
    } catch (error) {
      setErrorMessage("אירעה שגיאה בעת יצירת המשחק. נסה שוב מאוחר יותר.");
    }
  };

  const handleJoinGame = async () => {
    if (!gameIdInput) {
      setErrorMessage("יש להזין קוד משחק");
      return;
    }

    try {
      const res = await fetch(`https://194.90.158.74/cgroup81/test2/tar1/api/games/${gameIdInput}/is-joinable`);
      const data = await res.json();

      if (!data.joinable) {
        setErrorMessage("המשחק לא קיים או שכבר התחיל.");
        return;
      }

      navigate(`/game-lobby/${gameIdInput}`);
    } catch (error) {
      setErrorMessage("שגיאה בבדיקת המשחק. נסה שוב.");
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      <Header />
      <BackgroundImage image={codenamesImage} />

      <div className="relative z-10 flex flex-col items-center justify-center flex-grow py-8 space-y-6">
        <MainHeadLine />

        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md text-center" role="alert">
            <strong className="font-bold">שגיאה:</strong> <span>{errorMessage}</span>
          </div>
        )}

        <button
          onClick={handleCreateGame}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          התחל משחק חדש
        </button>

        <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-md text-center space-y-4">
          <h2 className="text-xl font-bold text-gray-800">הצטרף למשחק קיים</h2>

          <input
            type="text"
            placeholder="הכנס קוד משחק"
            value={gameIdInput}
            onChange={(e) => setGameIdInput(e.target.value)}
            className="border px-4 py-2 rounded w-64 text-center"
          />

          <button
            onClick={handleJoinGame}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            הצטרף למשחק
          </button>
        </div>
      </div>

      <Footer className="mt-auto" />
    </div>
  );
};

export default Lobby;