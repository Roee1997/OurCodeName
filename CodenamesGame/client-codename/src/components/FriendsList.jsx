import React, { useEffect, useState } from "react";
import { auth } from "../../firebaseConfig";

const FriendsList = () => {
  const [friends, setFriends] = useState([]);
  const [error, setError] = useState("");

  const currentUser = auth.currentUser;
  const userId = currentUser?.uid;

  useEffect(() => {
    if (userId) fetchFriends();
  }, [userId]);

  const fetchFriends = async () => {
    try {
      const res = await fetch(`http://localhost:5150/api/friends/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch friends list");

      const data = await res.json();
      console.log("✅ Friends fetched:", data);
      setFriends(data);
    } catch (err) {
      console.error("❌ Error fetching friends:", err);
      setError("Failed to load friends list.");
    }
  };

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

      fetchFriends(); // refresh list
    } catch (error) {
      console.error("❌ Error removing friend:", error);
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-2">Your Friends</h2>
      {error && <p className="text-red-500">{error}</p>}

      {friends.length === 0 ? (
        <p className="text-gray-600">You have no friends yet.</p>
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
                <p className="text-sm text-gray-400">Since: {friend.FriendshipDate}</p>
              </div>
              <button
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => handleRemoveFriend(friend.UserID)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FriendsList;
