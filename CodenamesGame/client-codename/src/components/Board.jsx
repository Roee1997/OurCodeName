import React from "react";
import Card from "./Card";

const words = [
    { word: "קוד", team: "blue" }, 
    { word: "משחק", team: "red" },
    { word: "צוות", team: "blue" },
    { word: "מרגל", team: "red" },
    { word: "חשיבה", team: "blue" }, 
    { word: "תכנה", team: "red" },
    { word: "מתכנת", team: "blue" },
    { word: "פיתוח", team: "red" },
    { word: "סטודנט", team: "blue" },
    { word: "לימודים", team: "red" },
    { word: "קמפוס", team: "blue" },
    { word: "מחשב", team: "red" },
    { word: "אלגוריתם", team: "blue" },
    { word: "נתונים", team: "red" },
    { word: "שפה", team: "blue" },
    { word: "פונקציה", team: "red" },
    { word: "מערכת", team: "blue" },
    { word: "בסיס נתונים", team: "red" },
    { word: "רשת", team: "blue" },
    { word: "אינטרנט", team: "red" },
    { word: "בינה מלאכותית", team: "blue" },
    { word: "סייבר", team: "red" },
    { word: "קריפטוגרפיה", team: "blue" },
    { word: "לוגיקה", team: "red" },
    { word: "חישוב", team: "blue" },
    { word: "פרויקט", team: "red" },
    { word: "שגיאה", team: "blue" }
  ]; // 25 מילים
  

const Board = () => {
  return (
    <div className="board">
      {words.map((card, index) => (
        <Card key={index} word={card.word} team={card.team} />
      ))}
    </div>
  );
};

export default Board;