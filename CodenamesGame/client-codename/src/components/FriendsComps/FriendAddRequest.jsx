import React, { useState, useEffect } from "react";
import { auth, db } from "../../../firebaseConfig";
import { notifyFriendSync } from "../../services/firebaseService";
import { set, ref, onValue } from "firebase/database";

const FriendAddRequest = ({ receiverUser }) => {
  const [message, setMessage] = useState("");
  const [hideBox, setHideBox] = useState(false);
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!currentUser?.uid || !receiverUser?.userID) return;

    const senderID = currentUser.uid;
    const receiverID = receiverUser.userID;
    const statusRef = ref(db, `friendRequestsStatus/${senderID}/${receiverID}`);

    const unsubscribe = onValue(statusRef, (snapshot) => {
      const status = snapshot.val();
      if (status && ["Approved", "Cancelled", "Rejected"].includes(status)) {
        setHideBox(true); // hide the whole box
      }
    });

    return () => unsubscribe();
  }, [receiverUser]);

  const handleSendRequest = async () => {
    if (!currentUser || !receiverUser?.userID) {
      setMessage("❌ Invalid sender or receiver.");
      return;
    }

    const senderID = currentUser.uid;
    const receiverID = receiverUser.userID;

    try {
      const res = await fetch("http://localhost:5150/api/friends/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ senderID, receiverQuery: receiverUser.username }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ " + data.message);

        // Save request status to Firebase for realtime sync
        await set(ref(db, `friendRequestsStatus/${senderID}/${receiverID}`), "Pending");

        // Trigger UI refresh for both users
        await notifyFriendSync(senderID);
        await notifyFriendSync(receiverID);
      } else {
        setMessage("❌ " + (data.message || "Failed to send request"));
      }
    } catch (error) {
      console.error("Request error:", error);
      setMessage("❌ Error occurred while sending friend request.");
    }
  };

  if (hideBox) return null;

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
