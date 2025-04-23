import { motion } from "framer-motion";
import React from "react";
import assassinImg from "../assets/assasin.jpg";
import blueTeamImg from "../assets/blueteam.jpeg";
import neutralImg from "../assets/neutral.jpeg";
import redTeamImg from "../assets/redteam.jpeg";
import "../css/Card.css";

// קומפוננטת Card – מציגה קלף יחיד במשחק שם קוד
const Card = ({ card, gameId, canClick, onCardRevealed, currentTurn, userTeam, isSpymaster }) => {
  const { word, team, isRevealed, cardID } = card;

  // מחזיר את תמונת הרקע המתאימה לפי סוג הקלף
  const getCardImage = () => {
    switch (team) {
      case "Red": return redTeamImg;
      case "Blue": return blueTeamImg;
      case "Neutral": return neutralImg;
      case "Assassin": return assassinImg;
      default: return "";
    }
  };

  // טיפול בלחיצה על קלף – מאשר רק אם סוכן בתורו
  const handleClick = () => {
    if (!canClick || isRevealed) return;

    if (userTeam !== currentTurn || isSpymaster) {
      console.warn("⛔ לא תורך או שאתה לוחש – לא ניתן לנחש");
      return;
    }

    // מפעיל את הפונקציה מה־Board לחשיפת קלף
    if (onCardRevealed) onCardRevealed(card);
  };

  const cardImage = getCardImage();

  // קובע את סגנון הקלף – צבע/תמונה לפי מצב ותפקיד
  const cardStyle = isRevealed
    ? {
        backgroundImage: `url(${cardImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : isSpymaster
    ? {
        backgroundColor:
          team === "Red"
            ? "#ffdddd"
            : team === "Blue"
            ? "#ddddff"
            : team === "Assassin"
            ? "#888888"
            : "#eeeeee",
      }
    : {
        backgroundColor: "#eeeeee", // הסוכן רואה צבע אחיד לפני גילוי
      };

  // מציג את הקלף עם אנימציית flip בעת גילוי
  return (
    <motion.div
      onClick={handleClick}
      initial={{ rotateY: 0 }}
      animate={{ rotateY: isRevealed ? 180 : 0 }}
      transition={{ duration: 0.6 }}
      className="card-wrapper"
    >
      <div className="card" style={cardStyle}>
        {!isRevealed && (
          <div className="text-center font-bold text-lg text-black">{word}</div>
        )}
      </div>
    </motion.div>
  );
};

export default Card;
