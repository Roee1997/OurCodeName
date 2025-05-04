import { onValue, push, ref, set, remove , serverTimestamp,onDisconnect } from "firebase/database";
import { db } from "../../firebaseConfig"; // בגלל שהfirebaseConfig.js נמצא בשורש


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

export const subscribeToLobbyPlayers = (gameId, callback) => {
  const playersRef = ref(db, `lobbies/${gameId}/players`);
  return onValue(playersRef, (snapshot) => {
    const data = snapshot.val();
    const players = data ? Object.entries(data).map(([userID, val]) => ({ userID, ...val })) : [];
    callback(players);
  });
};

export const updateCardInFirebase = (gameId, updatedCard) => {
  const cardRef = ref(db, `games/${gameId}/cards/${updatedCard.cardID}`);
  return set(cardRef, updatedCard);
};

export const sendClueToFirebase = (gameId, clue) => {
  const cluesRef = ref(db, `games/${gameId}/clues`);
  return push(cluesRef, clue); // 🔁 שומר כל רמז כרשומה נפרדת
};

export const subscribeToClues = (gameId, callback) => {
  const cluesRef = ref(db, `games/${gameId}/clues`);
  return onValue(cluesRef, (snapshot) => {
    const data = snapshot.val();
    callback(data ? Object.values(data) : []);
  });
};

export const saveBoardToFirebase = (gameId, cards) => {
  const boardRef = ref(db, `games/${gameId}/cards`);
  return set(boardRef, cards);
};

/**
 * האזנה לשינויים בלוח Id - מזהה המשחק
 * @param {function} callback - פונקציה שתרוץ כשיש שינוי
 */




// ✅ חדש: הגדרת תור נוכחי
export const setTurn = (gameId, team) => {
  const turnRef = ref(db, `games/${gameId}/turn`);
  return set(turnRef, team);
};

// ✅ חדש: האזנה לתור הנוכחי
export const subscribeToTurn = (gameId, callback) => {
  const turnRef = ref(db, `games/${gameId}/turn`);
  return onValue(turnRef, (snapshot) => {
    const team = snapshot.val();
    callback(team);
  });
};

// שמירת הרמז האחרון
export const setLastClue = (gameId, clue) => {
  const lastClueRef = ref(db, `games/${gameId}/lastClue`);
  return set(lastClueRef, clue);
};

// האזנה לרמז האחרון
export const subscribeToLastClue = (gameId, callback) => {
  const lastClueRef = ref(db, `games/${gameId}/lastClue`);
  return onValue(lastClueRef, (snapshot) => {
    const clue = snapshot.val();
    callback(clue);
  });
};

export const setWinner = (gameId, winner) => {
  const refWinner = ref(db, `games/${gameId}/winner`);
  return set(refWinner, winner);
};

export const subscribeToWinner = (gameId, callback) => {
  const refWinner = ref(db, `games/${gameId}/winner`);
  return onValue(refWinner, (snapshot) => {
    callback(snapshot.val());
  });
};

export const setGameEnded = (gameId) => {
  const refEnded = ref(db, `games/${gameId}/gameEnded`);
  return set(refEnded, true);
};

export const subscribeToGameEnded = (gameId, callback) => {
  const refEnded = ref(db, `games/${gameId}/gameEnded`);
  return onValue(refEnded, (snapshot) => {
    const ended = snapshot.val();
    callback(ended);
  });
};




//FRIENDS SECTION////////////////////////////////////////////////////
export const subscribeToBoard = (gameId, callback) => {
  const boardRef = ref(db, `games/${gameId}/cards`);
  return onValue(boardRef, (snapshot) => {
    const data = snapshot.val();
    const cards = data ? Object.values(data) : [];
    console.log("📦 קלפים מ־Firebase:", cards);
    callback(cards);
  });
};

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
export const setUserOnlineStatus = (userId, isInGame = false, gameId = null) => {
  const statusRef = ref(db, `playersStatus/${userId}`);

  const onlineStatus = {
    online: true,
    inGame: isInGame,
    gameId: gameId,
    lastSeen: serverTimestamp(),
  };

  const offlineStatus = {
    online: false,
    inGame: false,
    gameId: null,
    lastSeen: serverTimestamp(),
  };

  // קובע את המשתמש כ-online
  set(statusRef, onlineStatus);

  // אם הדפדפן נסגר, המשתמש יהפוך אוטומטית ל-offline
  onDisconnect(statusRef).set(offlineStatus);
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




