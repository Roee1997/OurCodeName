import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LogoutButton from "./LogoutButton";
import { ref, onValue } from "firebase/database";
import { db } from "../../firebaseConfig"; // ודא שהנתיב נכון אצלך

const Header = () => {
  const { user } = useAuth();
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;

    const unreadRef = ref(db, `unreadMessages/${user.uid}`);

    const unsubscribe = onValue(unreadRef, (snapshot) => {
      const data = snapshot.val();
      const hasUnread = data && Object.values(data).some((v) => v === true);
      setHasUnreadMessages(hasUnread);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  return (
    <header className="bg-gray-900 text-white py-4 px-6 flex justify-between items-center shadow-md">
      {/* לוגו וטקסט */}
      <div className="text-2xl font-bold">
        <Link to="/">🎲 Codenames</Link>
      </div>

      {/* תפריט ניווט */}
      <nav className="flex space-x-4" dir="rtl">
        {user && (
          <Link to="/game" className="px-4 py-2 rounded-lg hover:bg-gray-700 transition">
            משחק
          </Link>
        )}
        <Link
          to="/friends"
          className="relative px-4 py-2 rounded-lg hover:bg-gray-700 transition"
        >
          חברים
          {hasUnreadMessages && (
            <span className="absolute top-1 left-0 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
          )}
        </Link>

        <Link to="/rules" className="px-4 py-2 rounded-lg hover:bg-gray-700 transition">
          חוקים
        </Link>
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
