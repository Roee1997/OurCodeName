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
    const foundCard = cards.find((c) => c.cardID === card.cardID);

    console.log("💡 card from cards[]:", foundCard);
    if (card.isRevealed) return;
    if (team !== currentTurn || isSpymaster) return;
  
    console.log("🔍 קלף נלחץ:", card.team, "← תור:", currentTurn);
  
    const res = await fetch(`http://localhost:5150/api/games/${gameId}/reveal/${card.cardID}`, {
      method: "PUT",
    });
  
    if (!res.ok) {
      console.error("❌ שגיאה ב־API של reveal");
      return;
    }
  
    await fetchBoard();
  
    const newGuessCount = guessCount + 1;
    setGuessCount(newGuessCount);
  
    const maxGuesses = lastClue?.number ?? 0;
  
    const cardTeam = card.team?.trim();
    const isAssassin = cardTeam === "Assassin";
    const isNeutral = cardTeam === "Neutral";
    const isOwnTeam = cardTeam === currentTurn;
    const isOpponent = (cardTeam === "Red" || cardTeam === "Blue") && cardTeam !== currentTurn;
  
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
