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
