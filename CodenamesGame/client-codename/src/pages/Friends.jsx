import React from "react";
import FriendSearch from "../components/FriendSearch";

const Friends = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Friends</h1>
      <FriendSearch />
    </div>
  );
};

export default Friends;
