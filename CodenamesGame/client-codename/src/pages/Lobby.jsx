import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import BackgroundImage from "../components/BackgroundImage";
import MainHeadLine from "../components/MainHeadLine";
import Header from "../components/Header";
import Footer from "../components/Footer";
import codenamesImage from '../assets/codename.webp';
import { setUserOnlineStatus } from "../services/firebaseService";
import { toast } from "react-toastify";
import { ref, onValue, set } from "firebase/database";
import { db } from "../../firebaseConfig";

const Lobby = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [gameIdInput, setGameIdInput] = useState("");

  useEffect(() => {
    if (user?.uid) {
      setUserOnlineStatus(user.uid, false, null);

      const invitationsRef = ref(db, `invitations/${user.uid}`);
      const unsubscribe = onValue(invitationsRef, (snapshot) => {
        const invitation = snapshot.val();
        if (invitation?.gameId) {
          const sender = invitation.fromName || "שחקן אלמוני";

          toast(
            ({ closeToast }) => (
              <div className="text-right">
                <div className="mb-2 font-bold">{sender} הזמין אותך למשחק!</div>
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    onClick={() => {
                      set(ref(db, `invitations/${user.uid}`), null);
                      closeToast();
                      navigate(`/game-lobby/${invitation.gameId}`);
                    }}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    הצטרף
                  </button>
                  <button
                    onClick={() => {
                      set(ref(db, `invitations/${user.uid}`), null);
                      closeToast();
                    }}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    דחה
                  </button>
                </div>
              </div>
            ),
            {
              position: "top-center",
              autoClose: false,
              closeOnClick: false,
              draggable: false,
              closeButton: true
            }
          );
        }
      });

      return () => unsubscribe();
    }
  }, [user]);

  const showToast = (message, type = "info") => {
    if (type === "success") toast.success(message);
    else if (type === "error") toast.error(message);
    else if (type === "warn") toast.warn(message);
    else toast.info(message);
  };

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

      if (!response.ok) throw new Error();
      const data = await response.json();

      showToast("🎮 המשחק נוצר בהצלחה!", "success");
      navigate(`/game-lobby/${data.gameID}`);
    } catch {
      showToast("⚠️ שגיאה ביצירת המשחק. נסה שוב מאוחר יותר.", "error");
    }
  };

  const handleJoinGame = async () => {
    if (!gameIdInput) {
      showToast("יש להזין קוד משחק", "error");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5150/api/games/${gameIdInput}/is-joinable`);
      const data = await res.json();

      if (!data.joinable) {
        showToast("המשחק לא קיים או שכבר התחיל.", "error");
        return;
      }

      navigate(`/game-lobby/${gameIdInput}`);
    } catch {
      showToast("שגיאה בבדיקת המשחק. נסה שוב.", "error");
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      <Header />
      <BackgroundImage image={codenamesImage} />

      <div className="relative z-10 flex flex-col items-center justify-center flex-grow py-8 space-y-6">
        <MainHeadLine />

        <button
          onClick={handleCreateGame}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          התחל משחק חדש
        </button>

        <div className="bg-white/30 backdrop-blur-md p-8 rounded-2xl shadow-xl text-center space-y-6 w-full max-w-md border border-white/50">
          <h2 className="text-2xl font-extrabold text-white drop-shadow">הצטרף למשחק קיים</h2>

          <input
            type="text"
            placeholder="הכנס קוד משחק"
            value={gameIdInput}
            onChange={(e) => setGameIdInput(e.target.value)}
            className="w-full px-5 py-3 text-center bg-white/70 text-gray-800 placeholder-gray-500 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />

          <button
            onClick={handleJoinGame}
            className="w-full py-3 bg-gradient-to-r from-indigo-400 to-blue-500 text-white font-semibold rounded-xl shadow-lg hover:from-indigo-500 hover:to-blue-600 transition-all"
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
