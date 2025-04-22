import React, { useEffect, useState } from "react";
import "../css/Board.css";
import { setTurn, subscribeToBoard, subscribeToLastClue } from "../services/firebaseService";
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
      console.log("📦 קלפים מהשרת:", data); // 🔎 תראה מה מגיע
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
    if (card.isRevealed) return;
    if (team !== currentTurn || isSpymaster) return;
    console.log("🔍 קלף נלחץ:", card.team, "← נגד", currentTurn);
    const res = await fetch(`http://localhost:5150/api/games/${gameId}/reveal/${card.cardID}`, {
      method: "PUT",
    });
  
    if (!res.ok) return;
  
    await fetchBoard();
  
    const newGuessCount = guessCount + 1;
    setGuessCount(newGuessCount);
  
    const maxGuesses = lastClue?.number ?? 0;
  
    const isAssassin = card.team === "Assassin";
    const isNeutral = card.team === "Neutral";
    const isOwnTeam = card.team === currentTurn;
  
    // ✅ מתקן את התנאי לזיהוי קלף של היריב בלבד
    const isOpponent =
      (card.team === "Red" || card.team === "Blue") &&
      card.team !== currentTurn;
  
    // 🔁 תור עובר מיידית במקרה של טעות
    if (isAssassin || isOpponent) {
      const nextTeam = currentTurn === "Red" ? "Blue" : "Red";
      await setTurn(gameId, nextTeam);
      console.log(`⛔ טעות (יריב או מתנקש) → תור עבר ל־${nextTeam}`);
      return;
    }
  
    // ✅ אם זה הניחוש האחרון (שלי או נייטרלי) – תור עובר
    if (newGuessCount >= maxGuesses) {
      const nextTeam = currentTurn === "Red" ? "Blue" : "Red";
      await setTurn(gameId, nextTeam);
      console.log(`✅ מוצו כל הניחושים → תור עבר ל־${nextTeam}`);
      return;
    }
  
    // ✅ אחרת התור נמשך
    console.log("✅ ניחוש תקף – התור ממשיך");
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
          onCardRevealed={() => handleCardClick(card)}
          currentTurn={currentTurn}
          userTeam={team}
          isSpymaster={isSpymaster}
        />
      ))}
    </div>
  );
};

export default Board;
