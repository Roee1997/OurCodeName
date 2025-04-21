import { onValue, ref, set } from "firebase/database";
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
export const subscribeToBoard = (gameId, callback) => {
  const boardRef = ref(db, `games/${gameId}/cards`);
  return onValue(boardRef, (snapshot) => {
    const data = snapshot.val();
    const cards = data ? Object.values(data) : [];
    console.log("📦 קלפים מ־Firebase:", cards); // ✅ תצוגה בקונסול
    callback(cards);
  });
};
