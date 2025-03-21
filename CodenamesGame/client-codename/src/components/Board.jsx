import React, { useState } from "react";
import Card from "./Card";
import ScoreBoard from "./ScoreBoard";

const initialCards = [
  { word: "חיים", team: "red" },
  { word: "שלום", team: "red" },
  { word: "עץ", team: "neutral" },
  { word: "פיגוע", team: "black" },
  { word: "חדר", team: "red" },
  { word: "כיסא", team: "blue" },
  { word: "שמש", team: "blue" },
  { word: "תפוח", team: "neutral" },
  // ... שאר הקלפים
];

const Board = () => {
  const [revealedCards, setRevealedCards] = useState(Array(initialCards.length).fill(false));

  const revealCard = (index) => {
    setRevealedCards((prev) => prev.map((val, i) => (i === index ? true : val)));
  };

  const score = {
    red: revealedCards.filter((_, i) => initialCards[i].team === "red" && revealedCards[i]).length,
    blue: revealedCards.filter((_, i) => initialCards[i].team === "blue" && revealedCards[i]).length,
  };

  return (
    <div className="flex flex-col items-center">
      <ScoreBoard score={score} />
      <div className="grid grid-cols-4 gap-4 mt-4">
        {initialCards.map((card, index) => (
          <Card key={index} word={card.word} team={card.team} revealed={revealedCards[index]} onReveal={() => revealCard(index)} />
        ))}
      </div>
    </div>
  );
};

export default Board;
