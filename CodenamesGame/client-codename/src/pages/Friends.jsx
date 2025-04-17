import React from "react";
import FriendSearch from "../components/FriendSearch";
import FriendsPendingRequests from "../components/FriendsPendingRequests"; // ⬅️ ייבוא הקומפוננטה החדשה

const Friends = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Friends</h1>

      <section className="mb-8">
        <FriendSearch />
      </section>

      <section className="mb-8">
        <FriendsPendingRequests />
      </section>

      {/* בהמשך נוסיף כאן את FriendsList ו-CreateGameInvite */}
    </div>
  );
};

export default Friends;
