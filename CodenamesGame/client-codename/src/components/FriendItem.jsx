import React from "react";
import { removeFriend } from "../services/friendsService";

const FriendItem = ({ friend, onRemove }) => {
  const handleRemoveFriend = async (friendID) => {
    try {
      const res = await fetch("http://localhost:5150/api/friends/remove", {
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
      console.log("🧹 Friend removed:", data);
  
      if (res.ok) {
        await notifyFriendSync(userId);      // שולח הרענון
        await notifyFriendSync(friendID);    // הצד השני מקבל רענון
      }
  
      fetchFriends();
    } catch (error) {
      console.error("❌ Error removing friend:", error);
    }
  };

  return (
    <li className="flex justify-between items-center p-2 border-b">
      <span className="text-lg">{friend.Username} (ID: {friend.UserID})</span>
      <button onClick={handleRemoveFriend} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
        Remove
      </button>
    </li>
  );
};

export default FriendItem;
