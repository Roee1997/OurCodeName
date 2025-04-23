import { onValue, push, ref, set, remove } from "firebase/database";
import { db } from "../../firebaseConfig";

// שומר שחקן ללובי (Realtime)
export const savePlayerToLobby = (gameId, player) => {
  const playerRef = ref(db, `lobbies/${gameId}/players/${player.userID}`);
  return set(playerRef, {
    username: player.username,
    team: player.team,
    isSpymaster: player.isSpymaster
  });
};

// מאזין לרשימת שחקנים בלובי
export const subscribeToLobbyPlayers = (gameId, callback) => {
  const playersRef = ref(db, `lobbies/${gameId}/players`);
  return onValue(playersRef, (snapshot) => {
    const data = snapshot.val();
    const players = data ? Object.entries(data).map(([userID, val]) => ({ userID, ...val })) : [];
    callback(players);
  });
};

// מעדכן קלף שנחשף ב־Firebase
export const updateCardInFirebase = (gameId, updatedCard) => {
  const cardRef = ref(db, `games/${gameId}/cards/${updatedCard.cardID}`);
  return set(cardRef, updatedCard);
};

// שולח רמז חדש לרשימת הרמזים
export const sendClueToFirebase = (gameId, clue) => {
  const cluesRef = ref(db, `games/${gameId}/clues`);
  return push(cluesRef, clue);
};

// מאזין לכל הרמזים שנשלחו
export const subscribeToClues = (gameId, callback) => {
  const cluesRef = ref(db, `games/${gameId}/clues`);
  return onValue(cluesRef, (snapshot) => {
    const data = snapshot.val();
    callback(data ? Object.values(data) : []);
  });
};

// שומר את לוח הקלפים (כולו) ל־Realtime
export const saveBoardToFirebase = (gameId, cards) => {
  const boardRef = ref(db, `games/${gameId}/cards`);
  return set(boardRef, cards);
};

// מאזין לשינויים בלוח הקלפים (למשל קלף נחשף)
export const subscribeToBoard = (gameId, callback) => {
  const boardRef = ref(db, `games/${gameId}/cards`);
  return onValue(boardRef, (snapshot) => {
    const data = snapshot.val();
    const cards = data ? Object.values(data) : [];
    console.log("📦 קלפים מ־Firebase:", cards);
    callback(cards);
  });
};

// מגדיר את התור הנוכחי של המשחק
export const setTurn = (gameId, team) => {
  const turnRef = ref(db, `games/${gameId}/turn`);
  return set(turnRef, team);
};

// מאזין לשינויים בתור הנוכחי
export const subscribeToTurn = (gameId, callback) => {
  const turnRef = ref(db, `games/${gameId}/turn`);
  return onValue(turnRef, (snapshot) => {
    const team = snapshot.val();
    callback(team);
  });
};

// שומר את הרמז האחרון שנשלח
export const setLastClue = (gameId, clue) => {
  const lastClueRef = ref(db, `games/${gameId}/lastClue`);
  return set(lastClueRef, clue);
};

// מאזין לרמז האחרון של הקבוצה בתור
export const subscribeToLastClue = (gameId, callback) => {
  const lastClueRef = ref(db, `games/${gameId}/lastClue`);
  return onValue(lastClueRef, (snapshot) => {
    const clue = snapshot.val();
    callback(clue);
  });
};

// שומר את הקבוצה המנצחת
export const setWinner = (gameId, winner) => {
  const refWinner = ref(db, `games/${gameId}/winner`);
  return set(refWinner, winner);
};

// מאזין להכרזת זוכה במשחק
export const subscribeToWinner = (gameId, callback) => {
  const refWinner = ref(db, `games/${gameId}/winner`);
  return onValue(refWinner, (snapshot) => {
    callback(snapshot.val());
  });
};

// מסמן שהמשחק הסתיים (לצורך מעבר ללובי)
export const setGameEnded = (gameId) => {
  const refEnded = ref(db, `games/${gameId}/gameEnded`);
  return set(refEnded, true);
};

// מאזין למעבר אוטומטי ללובי לאחר סיום
export const subscribeToGameEnded = (gameId, callback) => {
  const refEnded = ref(db, `games/${gameId}/gameEnded`);
  return onValue(refEnded, (snapshot) => {
    const ended = snapshot.val();
    callback(ended);
  });
};

// 🔁 מסנכרן שינוי חבר
export const notifyFriendSync = (userId) => {
  const syncRef = ref(db, `friendSync/${userId}`);
  return set(syncRef, Date.now());
};

// מאזין לסנכרון עם חבר (למשל קבלת בקשה)
export const subscribeToFriendSync = (userId, callback) => {
  const syncRef = ref(db, `friendSync/${userId}`);
  return onValue(syncRef, () => {
    callback();
  });
};

// שולח הודעה בצ'אט בין שני שחקנים
export const sendMessage = (userId1, userId2, messageObj) => {
  const chatId = [userId1, userId2].sort().join("_");
  const chatRef = ref(db, `chats/${chatId}`);
  const newMessageRef = push(chatRef);
  return set(newMessageRef, messageObj);
};

// מאזין להודעות בצ'אט בין שני שחקנים
export const subscribeToChat = (userId1, userId2, callback) => {
  const chatId = [userId1, userId2].sort().join("_");
  const chatRef = ref(db, `chats/${chatId}`);
  return onValue(chatRef, (snapshot) => {
    const messages = snapshot.val() || {};
    const messageArray = Object.entries(messages).map(([id, value]) => ({ id, ...value }));
    callback(messageArray);
  });
};

// מוחק צ'אט אם ההודעה האחרונה ישנה מ־12 שעות
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

// מאזין להתראות של הודעות שלא נקראו
export const subscribeToUnreadMessages = (userId, callback) => {
  const unreadRef = ref(db, `unread/${userId}`);
  return onValue(unreadRef, (snapshot) => {
    const data = snapshot.val() || {};
    callback(data);
  });
};

// מנקה את מצב "unread" לאחר קריאת צ'אט
export const clearUnreadForFriend = (userId, friendId) => {
  const refPath = ref(db, `unread/${userId}/${friendId}`);
  return remove(refPath);
};

// מאזין להתרעה על הודעה שלא נקראה בצ'אט מול חבר מסוים
export const subscribeToChatMeta = (currentUserId, friendId, callback) => {
  const notifyRef = ref(db, `unreadMessages/${currentUserId}/${friendId}`);
  return onValue(notifyRef, (snapshot) => {
    const hasNew = snapshot.exists();
    callback(hasNew);
  });
};

// שולח התראה על בקשת חברות חדשה
export const notifyFriendRequestAlert = (receiverId) => {
  const alertRef = ref(db, `friendRequestAlerts/${receiverId}`);
  return set(alertRef, true);
};

// מאזין להתראות של בקשות חברות
export const subscribeToFriendRequestAlerts = (userId, callback) => {
  const alertRef = ref(db, `friendRequestAlerts/${userId}`);
  return onValue(alertRef, (snapshot) => {
    const hasAlert = snapshot.exists();
    callback(hasAlert);
  });
};

// מנקה התראה לאחר הצגה
export const clearFriendRequestAlert = (userId) => {
  const alertRef = ref(db, `friendRequestAlerts/${userId}`);
  return remove(alertRef);
};

// מאזין לבקשות חברות שנשלחו למשתמש (סטטוס Pending)
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
      callback();
    }
  });
};
