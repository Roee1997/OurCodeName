import { ref, set, onValue, push, remove } from "firebase/database";
import { db } from "../../firebaseConfig";

/**
 * שומר שחקן ב־Realtime Database
 * @param {string} gameId - מזהה המשחק
 * @param {object} player - { userID, username, team, isSpymaster }
 */
export const savePlayerToLobby = (gameId, player) => {
  const playerRef = ref(db, `lobbies/${gameId}/players/${player.userID}`);
  return set(playerRef, {
    username: player.username,
    team: player.team,
    isSpymaster: player.isSpymaster
  });
};

/**
 * האזנה לשינויים ברשימת שחקנים בלובי
 * @param {string} gameId - מזהה המשחק
 * @param {function} callback - פונקציה שתרוץ כשיש שינוי
 */
export const subscribeToLobbyPlayers = (gameId, callback) => {
  const playersRef = ref(db, `lobbies/${gameId}/players`);
  return onValue(playersRef, (snapshot) => {
    const data = snapshot.val();
    const players = data ? Object.entries(data).map(([userID, val]) => ({ userID, ...val })) : [];
    callback(players);
  });
};
// 🔄 שומר קלף שהתעדכן (למשל נחשף)
export const updateCardInFirebase = (gameId, updatedCard) => {
  const cardRef = ref(db, `games/${gameId}/cards/${updatedCard.cardID}`);
  return set(cardRef, updatedCard);
};
// שמירת רמז ב־Realtime Database
export const sendClueToFirebase = (gameId, clue) => {
  const cluesRef = ref(db, `games/${gameId}/clues`);
  return push(cluesRef, clue); // 🔁 שומר כל רמז כרשומה נפרדת
};

// האזנה לרמזים
export const subscribeToClues = (gameId, callback) => {
  const cluesRef = ref(db, `games/${gameId}/clues`);
  return onValue(cluesRef, (snapshot) => {
    const data = snapshot.val();
    callback(data ? Object.values(data) : []);
  });
};


/**
 * שומר את לוח המשחק ב־Realtime Database
 * @param {string} gameId - מזהה המשחק
 * @param {Array} cards - מערך קלפים
 */
export const saveBoardToFirebase = (gameId, cards) => {
  const boardRef = ref(db, `games/${gameId}/cards`);
  return set(boardRef, cards);
};

/**
 * האזנה לשינויים בלוח Id - מזהה המשחק
 * @param {function} callback - פונקציה שתרוץ כשיש שינוי
 */









//FRIENDS SECTION////////////////////////////////////////////////////
export const subscribeToBoard = (gameId, callback) => {
  const boardRef = ref(db, `games/${gameId}/cards`);
  return onValue(boardRef, (snapshot) => {
    const data = snapshot.val();
    const cards = data ? Object.values(data) : [];
    console.log("📦 קלפים מ־Firebase:", cards); // ✅ תצוגה בקונסול
    callback(cards);
  });
};

// Trigger realtime friend sync (write a timestamp)
export const notifyFriendSync = (userId) => {
  const syncRef = ref(db, `friendSync/${userId}`);
  return set(syncRef, Date.now());
};

// Listen for changes in friendSync/{userId}
export const subscribeToFriendSync = (userId, callback) => {
  const syncRef = ref(db, `friendSync/${userId}`);
  return onValue(syncRef, () => {
    callback();
  });
};



// Save new message between two users
export const sendMessage = (userId1, userId2, messageObj) => {
  const chatId = [userId1, userId2].sort().join("_");
  const chatRef = ref(db, `chats/${chatId}`);
  const newMessageRef = push(chatRef);
  return set(newMessageRef, messageObj);
};

// Listen to messages between two users
export const subscribeToChat = (userId1, userId2, callback) => {
  const chatId = [userId1, userId2].sort().join("_");
  const chatRef = ref(db, `chats/${chatId}`);
  return onValue(chatRef, (snapshot) => {
    const messages = snapshot.val() || {};
    const messageArray = Object.entries(messages).map(([id, value]) => ({ id, ...value }));
    callback(messageArray);
  });
};

// Clear chat if last message is older than 12 hours (optional helper)
export const clearChatIfOld = async (userId1, userId2) => {
  const chatId = [userId1, userId2].sort().join("_");
  const chatRef = ref(db, `chats/${chatId}`);
  onValue(chatRef, (snapshot) => {
    const messages = snapshot.val();
    if (!messages) return;

    const lastMessage = Object.values(messages).slice(-1)[0];
    const twelveHoursAgo = Date.now() - 12 * 60 * 60 * 1000;

    if (lastMessage?.timestamp < twelveHoursAgo) {
      remove(chatRef);
    }
  });
};


// Check if new messages were received
export const subscribeToUnreadMessages = (userId, callback) => {
  const unreadRef = ref(db, `unread/${userId}`);
  return onValue(unreadRef, (snapshot) => {
    const data = snapshot.val() || {};
    callback(data); // Format: { [friendId]: true }
  });
};

// Mark messages as read after opening chat
export const clearUnreadForFriend = (userId, friendId) => {
  const refPath = ref(db, `unread/${userId}/${friendId}`);
  return remove(refPath);
};

// Check if new unread message was received for a specific chat
export const subscribeToChatMeta = (currentUserId, friendId, callback) => {
  const notifyRef = ref(db, `unreadMessages/${currentUserId}/${friendId}`);
  return onValue(notifyRef, (snapshot) => {
    const hasNew = snapshot.exists();
    callback(hasNew);
  });
};


// ✅ 🔔 שליחת התראה על בקשת חברות חדשה
export const notifyFriendRequestAlert = (receiverId) => {
  const alertRef = ref(db, `friendRequestAlerts/${receiverId}`);
  return set(alertRef, true);
};

// ✅ האזנה להתראות על בקשת חברות
export const subscribeToFriendRequestAlerts = (userId, callback) => {
  const alertRef = ref(db, `friendRequestAlerts/${userId}`);
  return onValue(alertRef, (snapshot) => {
    const hasAlert = snapshot.exists();
    callback(hasAlert);
  });
};

// אופציונלי – לנקות התראה לאחר שהוצגה
export const clearFriendRequestAlert = (userId) => {
  const alertRef = ref(db, `friendRequestAlerts/${userId}`);
  return remove(alertRef);
};

export const subscribeToReceivedFriendRequests = (userId, callback) => {
  const refPath = ref(db, `friendRequestsStatus`);
  return onValue(refPath, (snapshot) => {
    const allStatuses = snapshot.val() || {};
    const received = Object.entries(allStatuses)
      .flatMap(([senderId, receivers]) =>
        Object.entries(receivers).filter(
          ([receiverId, status]) =>
            receiverId === userId && status === "Pending"
        ).map(([receiverId, status]) => ({ senderId, receiverId, status }))
      );
    if (received.length > 0) {
      callback(); // ניתן גם להעביר את הרשימה אם צריך
    }
  });
};

//FRIENDS SECTION////////////////////////////////////////////////////




