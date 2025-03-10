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
      <nav className="flex space-x-4 " dir="rtl">
        {user && <Link to="/game" className="px-4 py-2 rounded-lg hover:bg-gray-700 transition">משחק</Link>}
        <Link to="/friends" className="px-4 py-2 rounded-lg hover:bg-gray-700 transition">חברים</Link>
        <Link to="/rules" className="px-4 py-2 rounded-lg hover:bg-gray-700 transition">חוקים</Link>
      </nav>

      {/* כפתור התחברות/התנתקות */}
      <div>
        {user ? <LogoutButton /> : (
          <Link to="/login" className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition">
            התחברות
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
