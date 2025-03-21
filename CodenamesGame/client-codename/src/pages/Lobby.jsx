import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // אם יש לך AuthContext שמנהל את המידע על המשתמש
import BackgroundImage from "../components/BackgroundImage";
import MainHeadLine from "../components/MainHeadLine";
import Header from "../components/Header";
import LoginButtons from "../components/LoginButtons";
import Footer from "../components/Footer";
import codenamesImage from '../assets/codename.webp';
import LogoutButton from "../components/LogoutButton";

const Lobby = () => {
  const { user, logout } = useAuth(); // גישה למידע על המשתמש המחובר

  if (!user) {
    // אם המשתמש לא מחובר, להחזיר אותו לדף הבית או להתחברות
    return <p>יש להתחבר כדי לגשת לדף זה.</p>;
  }
  const handleCreateGame = async () => {
    try {
      const response = await fetch("https://localhost:5150/api/games", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          createdBy: user.uid // או user.email לפי מה ששמרת ב-SQL
        })
      });
  
      if (!response.ok) {
        throw new Error("שגיאה בתגובה מהשרת");
      }
  
      const data = await response.json();
      const gameId = data.gameID;
  
      // ⬅️ ניווט ללובי של המשחק החדש
      navigate(`/game-lobby/${gameId}`);
    } catch (error) {
      console.error("שגיאה ביצירת משחק:", error);
      alert("אירעה שגיאה בעת יצירת המשחק.");
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      <Header /> {/* ✅ הוספת הניווט בראש הדף */}

      
      {/* רקע */}
      <BackgroundImage image={codenamesImage} />

      {/* תוכן הדף */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-grow py-8 space-y-6">
        <MainHeadLine />

        {/* אזור ברוכים הבאים */}
        <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-md text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            ברוך הבא, {user.displayName || user.email}!
          </h1>
          <p className="text-gray-600 mt-2">בחר איך להמשיך</p>
        </div>

        {/* כפתורים לפעולות */}
        <div className="flex space-x-4">
        <button
  onClick={handleCreateGame}
  className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
>
  התחל משחק חדש
</button>

          <Link to="/join" className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition">
            הצטרף למשחק קיים
          </Link>
        </div>
      </div>

      {/* פוטר */}
      <Footer className="mt-auto" />

      {/* כפתור התנתקות */}
      <div className="absolute top-4 right-4 z-50">
        <LogoutButton />
      </div>
    </div>
  );
};

export default Lobby;