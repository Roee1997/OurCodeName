import React, { useEffect, useState } from "react";
import { ref, onValue, set } from "firebase/database";
import { db } from "../../../firebaseConfig";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router-dom";

const OnlineFriendsList = ({ userId, currentGameId }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [friends, setFriends] = useState([]);
  const [statusMap, setStatusMap] = useState({});

  useEffect(() => {
    if (!userId) return;

    const fetchFriends = async () => {
      try {
        const res = await fetch(`http://localhost:5150/api/friends/${userId}`);
        const data = await res.json();

        let friendsArray = [];
        if (Array.isArray(data)) {
          friendsArray = data;
        } else if (typeof data === "object" && data !== null) {
          friendsArray = Object.values(data);
        }

        setFriends(friendsArray);
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

  useEffect(() => {
    if (!userId) return;

    // רשימת עמודים שבהם לא נרצה להציג התראה
    const excludedPaths = ["/login", "/register", "/game/"];
    const shouldShowToast = !excludedPaths.some(path => location.pathname.startsWith(path));

    const invitationsRef = ref(db, `invitations/${userId}`);
    const unsubscribe = onValue(invitationsRef, (snapshot) => {
      const invitation = snapshot.val();
      if (invitation?.gameId && shouldShowToast) {
        const sender = invitation.fromName || "שחקן אחר";
        toast.info(
          `${sender} הזמין אותך למשחק!`,
          {
            position: "top-center",
            autoClose: 10000,
            onClick: () => {
              set(ref(db, `invitations/${userId}`), null);
              window.location.href = `/game-lobby/${invitation.gameId}`;
            }
          }
        );
      }
    });

    return () => unsubscribe();
  }, [userId, location]);

  const sendInvitation = async (friendId) => {
    try {
      await set(ref(db, `invitations/${friendId}`), {
        from: userId,
        fromName: user?.displayName || "שחקן אלמוני",
        gameId: currentGameId,
        timestamp: Date.now(),
      });
      toast.success("ההזמנה נשלחה בהצלחה!");
    } catch (err) {
      console.error("שגיאה בשליחת הזמנה:", err);
      toast.error("אירעה שגיאה בשליחת ההזמנה.");
    }
  };

  const grouped = {
    online: [],
    inGame: [],
    offline: [],
  };

  friends.forEach((friend) => {
    const status = statusMap[friend.UserID] || {};
    if (status.online && !status.inGame) {
      grouped.online.push(friend);
    } else if (status.online && status.inGame) {
      grouped.inGame.push(friend);
    } else {
      grouped.offline.push(friend);
    }
  });

  const renderGroup = (title, list) => (
    <>
      {list.length > 0 && (
        <>
          <h3 className="text-white font-bold text-lg mt-4">{title}</h3>
          {list.map((friend) => {
            const status = statusMap[friend.UserID] || {};
            const isOnline = status.online;
            const isInGame = status.inGame;

            const statusIcon = isInGame
              ? "🕹️"
              : isOnline
              ? "🟢"
              : "❌";

            return (
              <div
                key={friend.UserID}
                className="bg-white/20 backdrop-blur p-4 rounded shadow flex items-center justify-between text-white"
              >
                <div className="flex items-center w-full justify-between gap-4">
                  <span className="text-lg">{statusIcon}</span>
                  <span className="flex-1 text-center font-semibold">{friend.Username}</span>
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
              </div>
            );
          })}
        </>
      )}
    </>
  );

  return (
    <div className="space-y-3">
      {renderGroup("חברים מחוברים", grouped.online)}
      {renderGroup("חברים במשחק", grouped.inGame)}
      {renderGroup("חברים מנותקים", grouped.offline)}
    </div>
  );
};

export default OnlineFriendsList;
