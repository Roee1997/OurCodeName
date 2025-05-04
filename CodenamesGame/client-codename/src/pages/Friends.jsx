import React from "react";
import FriendSearch from "../components/FriendsComps/FriendSearch";
import FriendsPendingRequests from "../components/FriendsComps/FriendsPendingRequests";
import FriendsList from "../components/FriendsComps/FriendsList";
import BackgroundImage from "../components/BackgroundImage";
import Header from "../components/Header";
import Footer from "../components/Footer";
import codenamesImage from "../assets/codename.webp";

const Friends = () => {
  return (
    <div className="flex flex-col min-h-screen relative">
      <Header />
      <BackgroundImage image={codenamesImage} />

      {/* עוטף את כל התוכן בין Header ל-Footer */}
      <main className="relative z-10 flex-1 container mx-auto px-6 pt-28 pb-28 text-white" dir="rtl">

        <h1 className="text-4xl font-bold mb-8 text-center drop-shadow">ניהול חברים</h1>

        <div className="space-y-8">
          {/* 🔍 חיפוש שחקנים */}
          <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow text-black">
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">חיפוש שחקנים</h2>
            <FriendSearch />
          </div>

          {/* ⏳ בקשות ממתינות */}
          <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow text-black">
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">בקשות חברים ממתינות</h2>
            <FriendsPendingRequests />
          </div>

          {/* 🧑‍🤝‍🧑 רשימת חברים */}
          <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow text-black">
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">רשימת חברים קיימים</h2>
            <FriendsList />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Friends;
