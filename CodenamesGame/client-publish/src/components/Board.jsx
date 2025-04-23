import React, { useEffect, useState } from "react";
import "../css/Board.css";
import {
  setTurn,
  setWinner,
  subscribeToBoard,
  subscribeToLastClue,
  updateCardInFirebase,
} from "../services/firebaseService";
import Card from "./Card";

const Board = ({ gameId, user, team, isSpymaster, currentTurn, winner }) => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [guessCount, setGuessCount] = useState(0);
  const [lastClue, setLastClue] = useState(null);

  const fetchBoard = async () => {
    try {
      const res = await fetch(`https://194.90.158.74/cgroup81/test2/tar1/api/games/${gameId}/board/${user.uid}`);
      const data = await res.json();
      setCards(data);
    } catch (error) {
      console.error("❌ שגיאה בטעינת הלוח:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (gameId && user?.uid) {
      fetchBoard();
    }
  }, [gameId, user?.uid]);

  useEffect(() => {
    if (!gameId) return;

    const unsubBoard = subscribeToBoard(gameId, fetchBoard);
    const unsubClue = subscribeToLastClue(gameId, (clue) => {
      setLastClue(clue);
      setGuessCount(0); // התחלה חדשה לכל רמז חדש
    });

    return () => {
      unsubBoard();
      unsubClue();
    };
  }, [gameId]);

  const handleCardClick = async (card) => {
    const foundCard = cards.find((c) => c.cardID === card.cardID);
    if (!foundCard || foundCard.isRevealed || winner) return;

    if (team !== currentTurn || isSpymaster) return;
    if (!lastClue || lastClue.team !== currentTurn) {
      console.warn("⛔ לא נשלח רמז – הסוכן לא יכול לנחש");
      return;
    }

    const res = await fetch(`https://194.90.158.74/cgroup81/test2/tar1/api/games/${gameId}/reveal/${foundCard.cardID}`, {
      method: "PUT",
    });

    if (!res.ok) {
      console.error("❌ שגיאה ב־API של reveal");
      return;
    }

    await updateCardInFirebase(gameId, {
      ...foundCard,
      isRevealed: true
    });

    await fetchBoard();

    const newGuessCount = guessCount + 1;
    setGuessCount(newGuessCount);

    const maxGuesses = lastClue?.number ?? 0;
    const cardTeam = foundCard.team?.trim();
    const isAssassin = cardTeam === "Assassin";
    const isOwnTeam = cardTeam === currentTurn;
    const isOpponent = (cardTeam === "Red" || cardTeam === "Blue") && !isOwnTeam;

    // 💀 הפסד אוטומטי על מתנקש
    if (isAssassin) {
      const losingTeam = currentTurn === "Red" ? "RedLost" : "BlueLost";
      await setWinner(gameId, losingTeam);
      return;
    }

    // 🧮 בדיקת ניצחון לפי קלפים
    const redRevealed = cards.filter(c => c.isRevealed && c.team === "Red").length + (cardTeam === "Red" ? 1 : 0);
    const blueRevealed = cards.filter(c => c.isRevealed && c.team === "Blue").length + (cardTeam === "Blue" ? 1 : 0);

    if (redRevealed === 8) {
      await setWinner(gameId, "Red");
      return;
    }

    if (blueRevealed === 8) {
      await setWinner(gameId, "Blue");
      return;
    }

    if (isOpponent) {
      const nextTeam = currentTurn === "Red" ? "Blue" : "Red";
      await setTurn(gameId, nextTeam);
      return;
    }

    if (newGuessCount >= maxGuesses) {
      const nextTeam = currentTurn === "Red" ? "Blue" : "Red";
      await setTurn(gameId, nextTeam);
      return;
    }

    console.log(`✅ ניחוש תקף – ניחוש מספר ${newGuessCount} מתוך ${maxGuesses}`);
  };

  if (loading) return <p className="text-center">⏳ טוען לוח...</p>;
  if (cards.length === 0) return <p className="text-center text-red-500">😢 אין קלפים להצגה</p>;

  return (
    <div className="board-container">
      {cards.map((card) => (
        <Card
          key={card.cardID}
          card={card}
          gameId={gameId}
          canClick={!card.isRevealed && !winner} // ❌ חוסם קליקים אחרי סיום
          onCardRevealed={handleCardClick}
          currentTurn={currentTurn}
          userTeam={team}
          isSpymaster={isSpymaster}
        />
      ))}
    </div>
  );
};

export default Board;
