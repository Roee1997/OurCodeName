import { motion } from "framer-motion";
import React from "react";
import assassinImg from "../assets/assasin.jpg";
import blueTeamImg from "../assets/blueteam.jpeg";
import neutralImg from "../assets/neutral.jpeg";
import redTeamImg from "../assets/redteam.jpeg";
import "../css/Card.css";

const Card = ({ card, gameId, canClick, onCardRevealed, currentTurn, userTeam, isSpymaster }) => {
  const { word, team, isRevealed, cardID } = card;

  const getCardImage = () => {
    switch (team) {
      case "Red": return redTeamImg;
      case "Blue": return blueTeamImg;
      case "Neutral": return neutralImg;
      case "Assassin": return assassinImg;
      default: return "";
    }
  };

  const handleClick = () => {
    if (!canClick || isRevealed) return;

    if (userTeam !== currentTurn || isSpymaster) {
      console.warn("⛔ לא תורך או שאתה לוחש – לא ניתן לנחש");
      return;
    }

    // ✅ רק מפעיל את פונקציית ההורה (Board)
    if (onCardRevealed) onCardRevealed(card);
  };

  const cardImage = getCardImage();

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
        backgroundColor: "#eeeeee", // סוכן רואה הכל אפור לפני גילוי
      };

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
