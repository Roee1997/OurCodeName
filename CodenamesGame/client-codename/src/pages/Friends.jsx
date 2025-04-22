import React from "react";
import FriendSearch from "../components/FriendsComps/FriendSearch";
import FriendsPendingRequests from "../components/FriendsComps/FriendsPendingRequests"; // ⬅️ ייבוא הקומפוננטה החדשה
import FriendsList from "../components/FriendsComps/FriendsList";

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

      <section className="mb-8">
        <FriendsList />
      </section>

      {/* בהמשך נוסיף כאן את FriendsList ו-CreateGameInvite */}
    </div>
  );
};

export default Friends;
