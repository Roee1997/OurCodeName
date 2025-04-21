import { motion } from "framer-motion";
import React from "react";
import assassinImg from "../assets/assasin.jpg";
import blueTeamImg from "../assets/blueteam.jpeg";
import neutralImg from "../assets/neutral.jpeg";
import redTeamImg from "../assets/redteam.jpeg";

// ← אופציונלי: רקע לקלפים מוסתרים
const hiddenStyle = {
  backgroundColor: "#ccc",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "2rem",
  fontWeight: "bold",
  color: "#333",
};

const Card = ({ card, gameId, canClick, onCardRevealed }) => {
  const { word, team, isRevealed, cardID } = card;

  const getCardImage = () => {
    switch (team) {
      case "Red": return redTeamImg;
      case "Blue": return blueTeamImg;
      case "Neutral": return neutralImg;
      case "Black": return assassinImg;
      default: return ""; // למקרה של Hidden או טעות
    }
  };

  const handleClick = async () => {
    if (!canClick || isRevealed) return;

    try {
      await fetch(`http://localhost:5150/api/games/${gameId}/reveal/${cardId}`, {
        method: "PUT"
      });
      
      if (onCardRevealed) onCardRevealed(); // נקרא מחדש את הלוח מה-Firebase
    } catch (error) {
      console.error("❌ שגיאה בגילוי קלף:", error);
    }
  };

  return (
    <motion.div
      className="w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 flex justify-center items-center rounded-lg shadow-lg cursor-pointer transition-all duration-300 hover:scale-105"
      onClick={handleClick}
      initial={{ rotateY: 0 }}
      animate={{ rotateY: isRevealed ? 180 : 0 }}
      transition={{ duration: 0.6 }}
      style={
        isRevealed
          ? {
              backgroundImage: `url(${getCardImage()})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              border: "1px solid black",
            }
          : team === "Hidden"
          ? hiddenStyle
          : {
              backgroundColor:
                team === "Red"
                  ? "#ffdddd"
                  : team === "Blue"
                  ? "#ddddff"
                  : "#eeeeee",
              border: "1px solid black",
            }
      }
    >
      {!isRevealed && (
        <div className="text-center font-bold text-lg text-black">{word}</div>
      )}
    </motion.div>
  );
};

export default Card;
