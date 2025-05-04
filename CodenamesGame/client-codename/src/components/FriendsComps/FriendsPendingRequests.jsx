import React, { useEffect, useState } from "react";
import { auth } from "../../../firebaseConfig";
import { subscribeToFriendSync, notifyFriendSync, subscribeToReceivedFriendRequests } from "../../services/firebaseService";
import { remove, ref } from "firebase/database";
import { db } from "../../../firebaseConfig";
import { showToast } from "../../services/toastService";

const FriendsPendingRequests = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [error, setError] = useState("");

  const currentUser = auth.currentUser;
  const userId = currentUser?.uid;

  useEffect(() => {
    if (!userId) return;

    const unsubscribeSync = subscribeToFriendSync(userId, () => {
      fetchPendingRequests();
      fetchReceivedRequests();
    });

    const unsubscribeRealtimeReceived = subscribeToReceivedFriendRequests(userId, () => {
      fetchReceivedRequests();
    });

    return () => {
      unsubscribeSync();
      unsubscribeRealtimeReceived();
    };
  }, [userId]);

  const fetchPendingRequests = async () => {
    try {
      const res = await fetch(`http://localhost:5150/api/friends/pending-sent/${userId}`);
      if (!res.ok) throw new Error("שגיאה בטעינת הבקשות שנשלחו.");
      const data = await res.json();
      setPendingRequests(data);
    } catch (err) {
      console.error("שגיאה:", err);
      setError("שגיאה בטעינת בקשות שנשלחו.");
      showToast("שגיאה בטעינת בקשות שנשלחו.", "error");
    }
  };

  const fetchReceivedRequests = async () => {
    try {
      const res = await fetch(`http://localhost:5150/api/friends/pending-received/${userId}`);
      if (!res.ok) throw new Error("שגיאה בטעינת הבקשות שהתקבלו.");
      const data = await res.json();
      setReceivedRequests(data);
    } catch (err) {
      console.error("שגיאה:", err);
      setError("שגיאה בטעינת בקשות שהתקבלו.");
      showToast("שגיאה בטעינת בקשות שהתקבלו.", "error");
    }
  };

  const handleAcceptRequest = async (senderID, receiverID) => {
    try {
      const res = await fetch("http://localhost:5150/api/friends/accept", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderID, receiverID })
      });

      const data = await res.json();
      if (res.ok) {
        showToast("הבקשה אושרה בהצלחה.", "success");
        await notifyFriendSync(senderID);
        await notifyFriendSync(receiverID);
      } else {
        showToast(data.message || "הבקשה לא אושרה.", "error");
      }

      fetchPendingRequests();
      fetchReceivedRequests();
    } catch (error) {
      console.error("שגיאה באישור בקשה:", error);
      showToast("שגיאה באישור בקשה.", "error");
    }

    await remove(ref(db, `friendRequestsStatus/${senderID}/${receiverID}`));
  };

  const updateRequestStatus = async (senderID, receiverID, action) => {
    try {
      const res = await fetch("http://localhost:5150/api/friends/cancel", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderID, receiverID, action })
      });

      const data = await res.json();
      if (res.ok) {
        const msg = action === "cancel" ? "הבקשה בוטלה." : "הבקשה נדחתה.";
        showToast(msg, "success");
        await notifyFriendSync(senderID);
        await notifyFriendSync(receiverID);
      } else {
        showToast(data.message || "שגיאה בעדכון הבקשה.", "error");
      }

      fetchPendingRequests();
      fetchReceivedRequests();
    } catch (error) {
      console.error("שגיאה בעדכון סטטוס:", error);
      showToast("שגיאה בעדכון סטטוס.", "error");
    }

    await remove(ref(db, `friendRequestsStatus/${senderID}/${receiverID}`));
  };

  return (
    <div className="mb-8" dir="rtl">
      {error && <p className="text-red-500">{error}</p>}
      {!userId ? (
        <p className="text-gray-500">עליך להיות מחובר כדי לצפות בבקשות החברות.</p>
      ) : (
        <>
          <h2 className="text-xl font-semibold mb-2">בקשות חברות שנשלחו</h2>
          {pendingRequests.length === 0 ? (
            <p className="text-gray-600 mb-4">לא שלחת עדיין בקשות חברות.</p>
          ) : (
            <ul className="space-y-2 mb-6">
              {pendingRequests.map((user) => (
                <li key={user.userID} className="flex justify-between items-center bg-gray-100 p-3 rounded shadow">
                  <span>{user.username}</span>
                  <button
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={() => updateRequestStatus(userId, user.userID, "cancel")}
                  >
                    ביטול
                  </button>
                </li>
              ))}
            </ul>
          )}

          <h2 className="text-xl font-semibold mb-2">בקשות חברות שהתקבלו</h2>
          {receivedRequests.length === 0 ? (
            <p className="text-gray-600">אין לך בקשות חדשות.</p>
          ) : (
            <ul className="space-y-2">
              {receivedRequests.map((user) => (
                <li key={user.userID} className="flex justify-between items-center bg-gray-100 p-3 rounded shadow">
                  <span>{user.username}</span>
                  <div className="space-x-2">
                    <button
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                      onClick={() => handleAcceptRequest(user.userID, userId)}
                    >
                      אישור
                    </button>
                    <button
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      onClick={() => updateRequestStatus(user.userID, userId, "decline")}
                    >
                      דחייה
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default FriendsPendingRequests;
