import React, { useEffect, useState, useRef } from "react";
import { db } from "../../firebaseConfig";
import { ref, push, onValue, set, remove } from "firebase/database";

const ChatWindow = ({ currentUserId, friendId, friendName, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const chatId =
    currentUserId < friendId
      ? `${currentUserId}_${friendId}`
      : `${friendId}_${currentUserId}`;

  const messagesRef = ref(db, `chats/${chatId}/messages`);
  const metaRef = ref(db, `chats/${chatId}/meta`);

  useEffect(() => {
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      const msgList = data ? Object.values(data) : [];
      setMessages(msgList);
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const now = Date.now();
    const unsub = onValue(metaRef, (snapshot) => {
      const meta = snapshot.val();
      if (meta && meta.lastMessageTime && now - meta.lastMessageTime > 12 * 60 * 60 * 1000) {
        remove(ref(db, `chats/${chatId}`));
      }
    });

    // clear unread notification
    const unreadRef = ref(db, `unreadMessages/${currentUserId}/${friendId}`);
    remove(unreadRef);

    return () => unsub();
  }, []);

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return;

    const message = {
      sender: currentUserId,
      content: newMessage.trim(),
      timestamp: Date.now()
    };

    await push(messagesRef, message);
    await set(metaRef, { lastMessageTime: Date.now() });

    // notify friend
    const notifyRef = ref(db, `unreadMessages/${friendId}/${currentUserId}`);
    await set(notifyRef, true);

    setNewMessage("");
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white shadow-lg rounded p-4 border border-gray-300 z-50">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-lg">Chat with {friendName}</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-red-500">✕</button>
      </div>
      <div className="h-64 overflow-y-auto border rounded p-2 mb-2 bg-gray-50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-1 p-2 rounded ${
              msg.sender === currentUserId
                ? "bg-blue-200 text-right ml-10"
                : "bg-gray-300 text-left mr-10"
            }`}
          >
            {msg.content}
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>
      <div className="flex">
        <input
          type="text"
          className="flex-1 border p-2 rounded-l"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 text-white px-4 rounded-r hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
