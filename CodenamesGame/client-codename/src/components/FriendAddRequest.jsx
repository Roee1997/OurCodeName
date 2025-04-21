import React, { useState } from "react";
import { auth } from "../../firebaseConfig"; // נתיב לפי המיקום שלך

const FriendAddRequest = ({ receiverQuery }) => {
  const [message, setMessage] = useState("");

  const handleSendRequest = async () => {
    const currentUser = auth.currentUser;

    if (!currentUser || !currentUser.uid) {
      setMessage("❌ You must be logged in to send friend requests.");
      return;
    }

    const senderID = currentUser.uid;

    try {
      const res = await fetch("http://localhost:5150/api/friends/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ senderID, receiverQuery })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ " + data.message);
      } else {
        setMessage("❌ " + (data.message || "Failed to send request"));
      }
    } catch (error) {
      console.error("Request error:", error);
      setMessage("❌ Error occurred while sending friend request.");
    }
  };

  return (
    <div className="flex flex-col items-end ml-4">
      <button
        onClick={handleSendRequest}
        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Send Request
      </button>
      {message && <p className="mt-2 text-sm">{message}</p>}
    </div>
  );
};

export default FriendAddRequest;
