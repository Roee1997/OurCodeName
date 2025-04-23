import React, { useEffect, useState } from "react";
import { auth } from "../../../firebaseConfig";
import {
  subscribeToFriendSync,
  notifyFriendSync,
  subscribeToChatMeta
} from "../../services/firebaseService";
import ChatWindow from "../Chatwindow";

const FriendsList = () => {
  const [friends, setFriends] = useState([]);
  const [error, setError] = useState("");
  const [openChats, setOpenChats] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState({});

  const currentUser = auth.currentUser;
  const userId = currentUser?.uid;

  useEffect(() => {
    if (!userId) return;

    fetchFriends();

    const unsubscribeSync = subscribeToFriendSync(userId, () => {
      fetchFriends();
    });

    return () => unsubscribeSync();
  }, [userId]);

  useEffect(() => {
    if (!userId || friends.length === 0) return;

    const unsubscribes = friends.map((friend) =>
      subscribeToChatMeta(userId, friend.UserID, (hasNew) => {
        setUnreadMessages((prev) => ({
          ...prev,
          [friend.UserID]: hasNew
        }));
      })
    );

    return () => unsubscribes.forEach((unsub) => unsub());
  }, [friends, userId]);

  const fetchFriends = async () => {
    try {
      const res = await fetch(`https://194.90.158.74/cgroup81/test2/tar1/api/friends/${userId}`);
      if (!res.ok) throw new Error("שגיאה בטעינת רשימת החברים.");

      const data = await res.json();
      console.log("✅ חברים נטענו:", data);
      setFriends(data);
    } catch (err) {
      console.error("❌ שגיאה בטעינת חברים:", err);
      setError("שגיאה בטעינת רשימת החברים.");
    }
  };

  const handleRemoveFriend = async (friendID) => {
    try {
      const res = await fetch("https://194.90.158.74/cgroup81/test2/tar1/api/friends/remove", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userID: userId,
          friendID: friendID
        })
      });

      const data = await res.json();
      console.log("חבר הוסר:", data);

      if (res.ok) {
        await notifyFriendSync(userId);
        await notifyFriendSync(friendID);
      }

      fetchFriends();
    } catch (error) {
      console.error("❌ שגיאה בהסרת חבר:", error);
    }
  };

  const toggleChat = (friendID) => {
    setOpenChats((prev) =>
      prev.includes(friendID)
        ? prev.filter((id) => id !== friendID)
        : [...prev, friendID]
    );

    setUnreadMessages((prev) => ({
      ...prev,
      [friendID]: false
    }));
  };

  return (
    <div className="mb-8" dir="rtl">
      <h2 className="text-xl font-semibold mb-2">החברים שלך</h2>
      {error && <p className="text-red-500">{error}</p>}

      {friends.length === 0 ? (
        <p className="text-gray-600">אין לך חברים כרגע.</p>
      ) : (
        <ul className="space-y-2">
          {friends.map((friend) => (
            <li
              key={friend.UserID}
              className="flex justify-between items-center bg-gray-100 p-3 rounded shadow"
            >
              <div>
                <p className="font-semibold">{friend.Username}</p>
                <p className="text-sm text-gray-600">{friend.Email}</p>
                <p className="text-sm text-gray-400">
                  חבר מאז: {friend.FriendshipDate}
                </p>
              </div>
              <div className="space-x-2 relative">
                <button
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 relative"
                  onClick={() => toggleChat(friend.UserID)}
                >
                  הודעה
                  {unreadMessages[friend.UserID] && (
                    <span className="absolute top-0 right-0 mt-[-6px] mr-[-6px] w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                  )}
                </button>
                <button
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={() => handleRemoveFriend(friend.UserID)}
                >
                  הסר חבר
                </button>
              </div>

              {openChats.includes(friend.UserID) && (
                <ChatWindow
                  currentUserId={userId}
                  friendId={friend.UserID}
                  friendName={friend.Username}
                  onClose={() =>
                    setOpenChats((prev) =>
                      prev.filter((id) => id !== friend.UserID)
                    )
                  }
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FriendsList;
