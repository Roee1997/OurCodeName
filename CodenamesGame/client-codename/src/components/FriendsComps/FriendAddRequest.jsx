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
        setHideBox(true); // הסתרה אם כבר אושר/נדחה
      }
    });

    return () => unsubscribe();
  }, [receiverUser]);

  const handleSendRequest = async () => {
    if (!currentUser || !receiverUser?.userID) {
      setMessage("שגיאה: המשתמש אינו תקף.");
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
        setMessage("הבקשה נשלחה בהצלחה.");

        // סטטוס לפיירבייס
        await set(ref(db, `friendRequestsStatus/${senderID}/${receiverID}`), "Pending");

        // סימון בקשת חברות כהתראה למקבל
        await set(ref(db, `friendRequestAlerts/${receiverID}`), true);

        // טריגר סינכרון לחברים
        await notifyFriendSync(senderID);
        await notifyFriendSync(receiverID);
      } else {
        setMessage(data.message || "שליחת הבקשה נכשלה.");
      }
    } catch (error) {
      console.error("שגיאה בבקשה:", error);
      setMessage("אירעה שגיאה בעת שליחת בקשת החברות.");
    }
  };

  if (hideBox) return null;

  return (
    <div className="flex flex-col items-end ml-4" dir="rtl">
      <button
        onClick={handleSendRequest}
        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
      >
        שלח בקשת חברות
      </button>
      {message && <p className="mt-2 text-sm text-right">{message}</p>}
    </div>
  );
};

export default FriendAddRequest;
