import { motion } from "framer-motion";
import React from "react";
import assassinImg from "../assets/assasin.jpg";
import blueTeamImg from "../assets/blueteam.jpeg";
import neutralImg from "../assets/neutral.jpeg";
import redTeamImg from "../assets/redteam.jpeg";

const Card = ({ card, gameId, canClick, onCardRevealed }) => {
  const { word, team, isRevealed, cardID } = card;

  const getCardImage = () => {
    switch (team) {
      case "Red": return redTeamImg;
      case "Blue": return blueTeamImg;
      case "Neutral": return neutralImg;
      case "Black": return assassinImg;
      default: return ""; // אם הקלף עדיין מוסתר
    }
  };

  const handleClick = async () => {
    if (!canClick || isRevealed) return;

    try {
      await fetch(`http://localhost:5150/api/games/${gameId}/reveal/${cardID}`, {
        method: "PUT"
      });

      if (onCardRevealed) onCardRevealed();
    } catch (error) {
      console.error("❌ שגיאה בגילוי קלף:", error);
    }
  };

  return (
    <motion.div
      className="w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 flex flex-col justify-center items-center rounded-lg shadow-lg cursor-pointer transition-all duration-300 hover:scale-105 text-center"
      onClick={handleClick}
      initial={{ rotateY: 0 }}
      animate={{ rotateY: isRevealed ? 180 : 0 }}
      transition={{ duration: 0.6 }}
      style={{
        backgroundImage: isRevealed ? `url(${getCardImage()})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: isRevealed ? "transparent" : "#f0f0f0",
        border: "1px solid black",
        padding: "10px"
      }}
    >
      <div className="font-bold text-lg text-black">
        {word}
      </div>
    </motion.div>
  );
};

export default Card;
