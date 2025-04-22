import React, { useEffect, useState } from "react";
import { auth } from "../../firebaseConfig";
import { subscribeToFriendSync } from "../services/firebaseService";
import { notifyFriendSync } from "../services/firebaseService";
import { remove, ref } from "firebase/database";
import { db } from "../../firebaseConfig";




const FriendsPendingRequests = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [error, setError] = useState("");

  const currentUser = auth.currentUser;
  const userId = currentUser?.uid;

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = subscribeToFriendSync(userId, () => {
      fetchPendingRequests();
      fetchReceivedRequests();
    });

    return () => unsubscribe();
  }, [userId]);

  const fetchPendingRequests = async () => {
    try {
      const res = await fetch(`http://localhost:5150/api/friends/pending-sent/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch sent requests");
      const data = await res.json();
      setPendingRequests(data);
    } catch (err) {
      console.error("❌ Error fetching sent requests:", err);
      setError("Failed to load sent friend requests.");
    }
  };

  const fetchReceivedRequests = async () => {
    try {
      const res = await fetch(`http://localhost:5150/api/friends/pending-received/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch received requests");
      const data = await res.json();
      setReceivedRequests(data);
    } catch (err) {
      console.error("❌ Error fetching received requests:", err);
      setError("Failed to load received friend requests.");
    }
  };


  const handleAcceptRequest = async (senderID, receiverID) => {
    try {
      const res = await fetch("http://localhost:5150/api/friends/accept", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ senderID, receiverID })
      });

      const data = await res.json();
      console.log("✅ Accept response:", data);

      if (res.ok) {
        await notifyFriendSync(senderID);
        await notifyFriendSync(receiverID);
      }

      fetchPendingRequests();
      fetchReceivedRequests();
    } catch (error) {
      console.error("❌ Error accepting friend request:", error);
    }
    // הסרת רשומת המעקב
    await remove(ref(db, `friendRequestsStatus/${senderID}/${receiverID}`));
  };

  const updateRequestStatus = async (senderID, receiverID, action) => {
    try {
      const res = await fetch("http://localhost:5150/api/friends/cancel", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ senderID, receiverID, action })
      });

      const data = await res.json();
      console.log("✅ Status updated:", data);

      if (res.ok) {
        await notifyFriendSync(senderID);
        await notifyFriendSync(receiverID);
      }

      fetchPendingRequests();
      fetchReceivedRequests();
    } catch (error) {
      console.error("❌ Error updating request status:", error);
    }
    // הסרת רשומת המעקב
    await remove(ref(db, `friendRequestsStatus/${senderID}/${receiverID}`));
  };


  return (
    <div className="mb-8">
      {error && <p className="text-red-500">{error}</p>}
      {!userId ? (
        <p className="text-gray-500">You must be logged in to view friend requests.</p>
      ) : (
        <>
          {/* 🔹 Sent Requests */}
          <h2 className="text-xl font-semibold mb-2">Sent Friend Requests</h2>
          {pendingRequests.length === 0 ? (
            <p className="text-gray-600 mb-4">You haven't sent any friend requests.</p>
          ) : (
            <ul className="space-y-2 mb-6">
              {pendingRequests.map((user) => (
                <li
                  key={user.userID}
                  className="flex justify-between items-center bg-gray-100 p-3 rounded shadow"
                >
                  <span>{user.username}</span>
                  <button
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={() => updateRequestStatus(userId, user.userID, "cancel")}
                  >
                    Cancel Request
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* 🔹 Received Requests */}
          <h2 className="text-xl font-semibold mb-2">Received Friend Requests</h2>
          {receivedRequests.length === 0 ? (
            <p className="text-gray-600">You have no incoming friend requests.</p>
          ) : (
            <ul className="space-y-2">
              {receivedRequests.map((user) => (
                <li
                  key={user.userID}
                  className="flex justify-between items-center bg-gray-100 p-3 rounded shadow"
                >
                  <span>{user.username}</span>
                  <div className="space-x-2">
                    <button
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                      onClick={() => handleAcceptRequest(user.userID, userId)}
                    >
                      Accept
                    </button>
                    <button
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      onClick={() => updateRequestStatus(user.userID, userId, "decline")}
                    >
                      Decline
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
