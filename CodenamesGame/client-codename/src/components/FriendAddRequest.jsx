import React, { useState, useEffect } from "react";
import { auth } from "../../firebaseConfig";
import { notifyFriendSync } from "../services/firebaseService";
import { set, ref, onValue } from "firebase/database";
import { db } from "../../firebaseConfig";

const FriendAddRequest = ({ receiverQuery }) => {
  const [message, setMessage] = useState("");
  const [hideButton, setHideButton] = useState(false);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser || !currentUser.uid || !receiverQuery) return;

    const senderID = currentUser.uid;
    const statusRef = ref(db, `friendRequestsStatus/${senderID}/${receiverQuery}`);

    const unsubscribe = onValue(statusRef, (snapshot) => {
      const status = snapshot.val();
      if (!status || status !== "Pending") {
        setHideButton(false);
      } else {
        setHideButton(true);
      }
    });

    return () => unsubscribe();
  }, [receiverQuery]);

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

        // Get receiver's userID by re-searching
        const userRes = await fetch(`http://localhost:5150/api/friends/search?query=${receiverQuery}`);
        if (userRes.ok) {
          const foundUser = await userRes.json();

          // Save request status to Firebase for realtime update
          await set(ref(db, `friendRequestsStatus/${senderID}/${foundUser.userID}`), "Pending");

          // Trigger real-time sync update for both sides
          await notifyFriendSync(senderID);
          await notifyFriendSync(foundUser.userID);
        }
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
      {!hideButton && (
        <button
          onClick={handleSendRequest}
          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Send Request
        </button>
      )}
      {message && <p className="mt-2 text-sm">{message}</p>}
    </div>
  );
};

export default FriendAddRequest;
