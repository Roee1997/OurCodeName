import React, { useEffect, useState } from "react";
// import { getFriends, addFriend, removeFriend } from "../services/friendsService";

const Friends = () => {
  const [friends, setFriends] = useState([]);
  const [newFriendId, setNewFriendId] = useState("");

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    try {
      const data = await getFriends();
      setFriends(data);
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  const handleAddFriend = async () => {
    if (!newFriendId) return;
    try {
      await addFriend(newFriendId);
      fetchFriends(); // רענון הרשימה לאחר הוספה
      setNewFriendId("");
    } catch (error) {
      console.error("Error adding friend:", error);
    }
  };

  const handleRemoveFriend = async (friendId) => {
    try {
      await removeFriend(friendId);
      fetchFriends(); // רענון הרשימה לאחר מחיקה
    } catch (error) {
      console.error("Error removing friend:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Friends List</h1>
      
      {/* הוספת חבר חדש */}
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Enter User ID"
          value={newFriendId}
          onChange={(e) => setNewFriendId(e.target.value)}
          className="border p-2 rounded w-64"
        />
        <button
          onClick={handleAddFriend}
          className="ml-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Add Friend
        </button>
      </div>

      {/* רשימת חברים */}
      <ul className="bg-white shadow-md rounded-lg p-4">
        {friends.length > 0 ? (
          friends.map((friend) => (
            <li key={friend.UserID} className="flex justify-between items-center p-2 border-b">
              <span className="text-lg">{friend.Username} (ID: {friend.UserID})</span>
              <button
                onClick={() => handleRemoveFriend(friend.UserID)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Remove
              </button>
            </li>
          ))
        ) : (
          <p className="text-gray-500">You have no friends yet.</p>
        )}
      </ul>
    </div>
  );
};

export default Friends;
