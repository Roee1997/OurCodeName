import React from "react";
import Card from "./Card";

const cards = [
    { word: "חיים", team: "red" },
    { word: "שלום", team: "blue" },
    { word: "עץ", team: "neutral" },
    { word: "פיגוע", team: "black" },
    { word: "חדר", team: "red" },
    { word: "כיסא", team: "blue" },
    { word: "שמש", team: "neutral" },
    { word: "תפוח", team: "black" },
    
    // ... שאר הקלפים
  ];
  

const Board = () => {
    return (
        <div className="grid grid-cols-4 gap-4">
          {cards.map((card, index) => (
            <Card key={index} word={card.word} team={card.team} />
          ))}
        </div>
      );
    };

export default Board;