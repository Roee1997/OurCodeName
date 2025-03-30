import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import BackgroundImage from "../components/BackgroundImage";
import MainHeadLine from "../components/MainHeadLine";
import Header from "../components/Header";
import Footer from "../components/Footer";
import LogoutButton from "../components/LogoutButton";
import codenamesImage from '../assets/codename.webp';

const Lobby = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [gameIdInput, setGameIdInput] = useState("");

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

      const response = await fetch("http://localhost:5150/api/games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(gamePayload)
      });

      if (!response.ok) throw new Error("שגיאה ביצירת המשחק");

      const data = await response.json();
      const gameId = data.gameID;

      navigate(`/game-lobby/${gameId}`);
    } catch (error) {
      console.error("שגיאה ביצירת משחק:", error);
      alert("אירעה שגיאה בעת יצירת המשחק.");
    }
  };

  const handleJoinGame = async () => {
    if (!gameIdInput) {
      alert("יש להזין קוד משחק");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5150/api/games/${gameIdInput}/is-joinable`);
      const data = await res.json();

      if (!data.joinable) {
        alert("המשחק לא קיים או שכבר התחיל.");
        return;
      }

      navigate(`/game-lobby/${gameIdInput}`);
    } catch (error) {
      console.error("שגיאה בבדיקת קוד המשחק:", error);
      alert("שגיאה בבדיקת המשחק. נסה שוב.");
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      <Header />
      <BackgroundImage image={codenamesImage} />

      

      <div className="relative z-10 flex flex-col items-center justify-center flex-grow py-8 space-y-6">
        <MainHeadLine />

        {/* כפתור התחלת משחק */}
        <button
          onClick={handleCreateGame}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          התחל משחק חדש
        </button>

        {/* הצטרפות למשחק קיים */}
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
