import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // אם יש לך AuthContext שמנהל את המידע על המשתמש
import BackgroundImage from "../components/BackgroundImage";
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

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* רקע */}
      <BackgroundImage image={codenamesImage} />

      {/* תוכן הדף */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-grow py-8 space-y-6">
        <Header />
        
        {/* אזור ברוכים הבאים */}
        <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-md text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            ברוך הבא, {user.displayName || user.email}!
          </h1>
          <p className="text-gray-600 mt-2">בחר איך להמשיך</p>
        </div>

        {/* כפתורים לפעולות */}
        <div className="flex space-x-4">
          <Link to="/game" className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition">
            התחל משחק חדש
          </Link>
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