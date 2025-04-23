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
    <div className="relative min-h-screen flex flex-col">
      {/* 🔝 כותרת עליונה */}
      <Header />

      {/* 🖼️ רקע */}
      <BackgroundImage image={codenamesImage} />

      {/* 📦 תוכן עמוד חברים */}
      <div className="relative z-10 container mx-auto p-6 text-white" dir="rtl">
        <h1 className="text-4xl font-bold mb-8 text-center text-white drop-shadow">
          ניהול חברים
        </h1>

        {/* 🔍 חיפוש שחקנים */}
        <div className="mb-8 bg-white bg-opacity-90 p-6 rounded-lg shadow text-black">
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2">חיפוש שחקנים</h2>
          <FriendSearch />
        </div>

        {/* ⏳ בקשות ממתינות */}
        <div className="mb-8 bg-white bg-opacity-90 p-6 rounded-lg shadow text-black">
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2">בקשות חברים ממתינות</h2>
          <FriendsPendingRequests />
        </div>

        {/* 🧑‍🤝‍🧑 רשימת חברים */}
        <div className="mb-8 bg-white bg-opacity-90 p-6 rounded-lg shadow text-black">
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2">רשימת חברים קיימים</h2>
          <FriendsList />
        </div>
      </div>

      {/* ⚓ פוטר */}
      <Footer className="mt-auto" />
    </div>
  );
};

export default Friends;
