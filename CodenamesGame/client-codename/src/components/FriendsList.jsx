import React, { useEffect, useState } from "react";
import { getFriends, removeFriend } from "../services/friendsService";
import FriendItem from "./FriendItem";

const FriendsList = () => {
  const [friends, setFriends] = useState([]);

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

  return (
    <ul className="bg-white shadow-md rounded-lg p-4">
      {friends.length > 0 ? (
        friends.map((friend) => <FriendItem key={friend.UserID} friend={friend} onRemove={fetchFriends} />)
      ) : (
        <p className="text-gray-500">You have no friends yet.</p>
      )}
    </ul>
  );
};

export default FriendsList;
