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

      {/* 🖼️ רקע עם שקיפות */}
      <BackgroundImage image={codenamesImage} />

      {/* 📦 תוכן העמוד (RTL רק כאן) */}
      <div className="relative z-10 container mx-auto p-6 text-white" dir="rtl">
        <h1 className="text-3xl font-bold mb-4">רשימת החברים</h1>

        <section className="mb-8 bg-white bg-opacity-90 p-4 rounded shadow text-black">
          <FriendSearch />
        </section>

        <section className="mb-8 bg-white bg-opacity-90 p-4 rounded shadow text-black">
          <FriendsPendingRequests />
        </section>

        <section className="mb-8 bg-white bg-opacity-90 p-4 rounded shadow text-black">
          <FriendsList />
        </section>
      </div>

      {/* ⚓ פוטר */}
      <Footer className="mt-auto" />
    </div>
  );
};

export default Friends;
