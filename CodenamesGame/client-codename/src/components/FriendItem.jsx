import React from "react";
import { removeFriend } from "../services/friendsService";

const FriendItem = ({ friend, onRemove }) => {
  const handleRemoveFriend = async () => {
    try {
      await removeFriend(friend.UserID);
      onRemove();
    } catch (error) {
      console.error("Error removing friend:", error);
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
