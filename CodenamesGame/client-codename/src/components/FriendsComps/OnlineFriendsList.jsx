import React, { useEffect, useState } from "react";
import { ref, onValue, set } from "firebase/database";
import { db } from "../../../firebaseConfig";

const OnlineFriendsList = ({ userId, currentGameId }) => {
  const [friends, setFriends] = useState([]);
  const [statusMap, setStatusMap] = useState({});

  useEffect(() => {
    if (!userId) return; // הוספה כדי למנוע שגיאות כשה-userId לא מוגדר

    const fetchFriends = async () => {
      try {
        const res = await fetch(`http://localhost:5150/api/friends/${userId}`);
        const data = await res.json();
        setFriends(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("שגיאה בשליפת חברים:", err);
        setFriends([]);
      }
    };

    fetchFriends();

    const statusRef = ref(db, "playersStatus");
    onValue(statusRef, (snapshot) => {
      const allStatus = snapshot.val() || {};
      setStatusMap(allStatus);
    });
  }, [userId]);

  const sendInvitation = async (friendId) => {
    await set(ref(db, `invitations/${friendId}`), {
      from: userId,
      gameId: currentGameId,
      timestamp: Date.now(),
    });
  };

  return (
    <div className="space-y-3">
      {Array.isArray(friends) && friends.map(friend => {
        const status = statusMap[friend.UserID] || {};
        const isOnline = status.online;
        const isInGame = status.inGame;

        return (
          <div key={friend.UserID} className="bg-white/20 backdrop-blur p-4 rounded shadow flex justify-between items-center text-white">
            <div>
              <span className="font-semibold">{friend.Username}</span>{" "}
              {isInGame ? "🕹️ במשחק" : isOnline ? "🟢 מחובר" : "❌ מנותק"}
            </div>

            {isOnline && !isInGame ? (
              <button
                onClick={() => sendInvitation(friend.UserID)}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                הזמן למשחק
              </button>
            ) : (
              <span className="text-sm text-gray-300 italic">לא זמין להזמנה</span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default OnlineFriendsList;
