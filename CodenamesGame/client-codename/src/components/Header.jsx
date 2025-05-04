import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ref, onValue } from "firebase/database";
import { db } from "../../firebaseConfig";
import { subscribeToFriendRequestAlerts, clearFriendRequestAlert } from "../services/firebaseService";
import { showToast } from "../services/toastService"; // ✅

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const [hasFriendRequestAlert, setHasFriendRequestAlert] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  useEffect(() => {
    if (!user?.uid) return;

    const unreadRef = ref(db, `unreadMessages/${user.uid}`);
    let previousUnread = {};

    const unsubscribeMessages = onValue(unreadRef, (snapshot) => {
      const data = snapshot.val() || {};
      const hasUnread = Object.values(data).some((v) => v === true);
      setHasUnreadMessages(hasUnread);

      const newSender = Object.entries(data).find(
        ([senderId, val]) => val === true && !previousUnread[senderId]
      );

      if (newSender) {
        setPopupMessage("קיבלת הודעה חדשה!");
        setTimeout(() => setPopupMessage(""), 5000);
      }

      previousUnread = data;
    });

    const unsubscribeFriendAlert = subscribeToFriendRequestAlerts(user.uid, (hasAlert) => {
      setHasFriendRequestAlert(hasAlert);
      if (hasAlert) {
        setPopupMessage("קיבלת בקשת חברות חדשה!");
        setTimeout(() => {
          setPopupMessage("");
          clearFriendRequestAlert(user.uid);
        }, 5000);
      }
    });

    return () => {
      unsubscribeMessages();
      unsubscribeFriendAlert();
    };
  }, [user?.uid]);

  const handleLogout = async () => {
    try {
      await logout();
      showToast("התנתקת מהמערכת", "info"); // ✅
      navigate("/");
    } catch (error) {
      console.error("שגיאה בהתנתקות:", error);
      showToast("שגיאה בעת התנתקות", "error"); // ✅
    }
  };

  return (
    <header className="bg-gray-900 text-white py-4 px-6 flex justify-between items-center shadow-md">
      <div className="text-2xl font-bold">
        <Link to="/">Codenames</Link>
      </div>

      <nav className="flex space-x-4" dir="rtl">
        {user && <Link to="/lobby" className="px-4 py-2 rounded-lg hover:bg-gray-700 transition">משחק</Link>}
        <Link to="/friends" className="relative px-4 py-2 rounded-lg hover:bg-gray-700 transition">
          חברים
          {(hasUnreadMessages || hasFriendRequestAlert) && (
            <span className="absolute top-1 left-0 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
          )}
        </Link>
        <Link to="/rules" className="px-4 py-2 rounded-lg hover:bg-gray-700 transition">חוקים</Link>
      </nav>

      {user ? (
        <div className="flex items-center gap-4 bg-white/10 px-4 py-2 rounded-lg">
          <div className="text-sm text-right">
            <div className="text-gray-200">ברוך הבא</div>
            <div className="font-bold">{user.displayName || user.email}</div>
          </div>
          <button onClick={handleLogout} className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded transition text-white">
            התנתקות
          </button>
        </div>
      ) : (
        <Link
          to="/login"
          onClick={() => showToast("התחבר למערכת", "info")} // ✅
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition"
        >
          התחברות
        </Link>
      )}

      {popupMessage && (
        <div className="fixed top-4 right-4 z-50 bg-blue-500 text-white px-6 py-3 rounded shadow-lg animate-bounce" dir="rtl">
          {popupMessage}
        </div>
      )}
    </header>
  );
};

export default Header;
