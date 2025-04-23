import { onValue, push, ref, set } from "firebase/database";
import { db } from "../../firebaseConfig"; // בגלל שהfirebaseConfig.js נמצא בשורש

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
