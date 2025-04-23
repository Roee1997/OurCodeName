import React, { useEffect, useState } from "react";
import "../css/Board.css";
import {
  setTurn,
  subscribeToBoard,
  subscribeToLastClue,
  updateCardInFirebase, // ✅ ייבוא לפיירבייס
} from "../services/firebaseService";
import Card from "./Card";

const Board = ({ gameId, user, team, isSpymaster, currentTurn }) => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [guessCount, setGuessCount] = useState(0);
  const [lastClue, setLastClue] = useState(null);

  const fetchBoard = async () => {
    try {
      const res = await fetch(`http://localhost:5150/api/games/${gameId}/board/${user.uid}`);
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
    if (!foundCard || foundCard.isRevealed) return;

    if (team !== currentTurn || isSpymaster) return;

    if (!lastClue || lastClue.team !== currentTurn) {
      console.warn("⛔ לא נשלח רמז – הסוכן לא יכול לנחש");
      return;
    }

    const res = await fetch(`http://localhost:5150/api/games/${gameId}/reveal/${foundCard.cardID}`, {
      method: "PUT",
    });

    if (!res.ok) {
      console.error("❌ שגיאה ב־API של reveal");
      return;
    }

    // ✅ עדכון ל־Firebase → כדי שכל השחקנים יראו את הקלף נחשף
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
    const isNeutral = cardTeam === "Neutral";
    const isOwnTeam = cardTeam === currentTurn;
    const isOpponent = (cardTeam === "Red" || cardTeam === "Blue") && !isOwnTeam;

    if (isAssassin) {
      console.log("💀 קלף מתנקש – מעביר תור מייד");
      const nextTeam = currentTurn === "Red" ? "Blue" : "Red";
      await setTurn(gameId, nextTeam);
      return;
    }

    if (isOpponent) {
      console.log("❌ קלף של היריב – מעביר תור מייד");
      const nextTeam = currentTurn === "Red" ? "Blue" : "Red";
      await setTurn(gameId, nextTeam);
      return;
    }

    if (newGuessCount >= maxGuesses) {
      console.log("✅ מוצו הניחושים – מעביר תור");
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
          canClick={!card.isRevealed}
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
