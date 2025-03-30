import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LogoutButton from "./LogoutButton";

const Header = () => {
  const { user } = useAuth(); // קבלת המידע על המשתמש

  return (
    <header className="bg-gray-900 text-white py-4 px-6 flex justify-between items-center shadow-md">
      {/* לוגו וטקסט */}
      <div className="text-2xl font-bold">
        <Link to="/">🎲 Codenames</Link>
      </div>

      {/* תפריט ניווט */}
      <nav className="flex space-x-4" dir="rtl">
        {user && <Link to="/game" className="px-4 py-2 rounded-lg hover:bg-gray-700 transition">משחק</Link>}
        <Link to="/friends" className="px-4 py-2 rounded-lg hover:bg-gray-700 transition">חברים</Link>
        <Link to="/rules" className="px-4 py-2 rounded-lg hover:bg-gray-700 transition">חוקים</Link>
      </nav>

      {/* ברוך הבא + התנתקות */}
      {user ? (
        <div className="flex items-center gap-4 bg-white/10 px-4 py-2 rounded-lg">
          <div className="text-sm text-right">
            <div className="text-gray-200">ברוך הבא</div>
            <div className="font-bold">{user.displayName || user.email}</div>
          </div>
          <LogoutButton />
        </div>
      ) : (
        <Link to="/login" className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition">
          התחברות
        </Link>
      )}
    </header>
  );
};

export default Header;
