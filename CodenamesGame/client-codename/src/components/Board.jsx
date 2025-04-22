import React, { useEffect, useState } from "react";
import "../css/Board.css";
import { subscribeToBoard } from "../services/firebaseService"; // נוודא שזה קיים
import Card from "./Card";

const Board = ({ gameId, user }) => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBoard = async () => {
    try {
      const res = await fetch(`http://localhost:5150/api/games/${gameId}/board/${user.uid}`);
      const data = await res.json();
      console.log("📦 קלפים מהשרת:", data);
      setCards(data);
    } catch (error) {
      console.error("❌ שגיאה בטעינת הלוח:", error);
    } finally {
      setLoading(false);
    }
  };

  // טעינה ראשונית מהשרת
  useEffect(() => {
    if (gameId && user?.uid) {
      fetchBoard();
    }
  }, [gameId, user?.uid]);

  // האזנה לפיירבייס – רק כדי להפעיל fetchBoard מחדש
  useEffect(() => {
    if (!gameId) return;

    const unsubscribe = subscribeToBoard(gameId, () => {
      console.log("📡 שינוי מ־Firebase → מבצע fetchBoard()");
      fetchBoard(); // 🔁 קורא לפונקציה הבטוחה שלך
    });

    return () => unsubscribe();
  }, [gameId]);

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
          onCardRevealed={fetchBoard}
        />
      ))}
    </div>
  );
};

export default Board;
