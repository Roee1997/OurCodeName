import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    if (gameId && user?.uid) {
      fetchBoard();
    }
  }, [gameId, user?.uid]);

  if (loading) return <p className="text-center">⏳ טוען לוח...</p>;
  if (cards.length === 0) return <p className="text-center text-red-500">😢 אין קלפים להצגה</p>;

  return (
    <div className="grid grid-cols-5 gap-4 mt-4">
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
