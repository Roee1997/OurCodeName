import { motion } from "framer-motion";
import React from "react";
import assassinImg from "../assets/assasin.jpg";
import blueTeamImg from "../assets/blueteam.jpeg";
import neutralImg from "../assets/neutral.jpeg";
import redTeamImg from "../assets/redteam.jpeg";

const Card = ({ card, gameId, canClick, onCardRevealed }) => {
  const getCardImage = () => {
    switch (card.team?.toLowerCase()) {
      case "red":
        return redTeamImg;
      case "blue":
        return blueTeamImg;
      case "neutral":
        return neutralImg;
      case "assassin":
        return assassinImg;
      default:
        return "";
    }
  };

  const handleClick = async () => {
    if (card.isRevealed || !canClick) return;

    try {
      await fetch(`http://localhost:5150/api/games/${gameId}/reveal/${card.cardID}`, {
        method: "PUT"
      });

      onCardRevealed(); // טען לוח מחדש
    } catch (err) {
      console.error("שגיאה בחשיפת קלף", err);
    }
  };

  return (
    <motion.div
      className="w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 flex justify-center items-center rounded-lg shadow-lg cursor-pointer transition-all duration-300 hover:scale-105"
      onClick={handleClick}
      initial={{ rotateY: 0 }}
      animate={{ rotateY: card.isRevealed ? 180 : 0 }}
      transition={{ duration: 0.6 }}
      style={{
        backgroundImage: card.isRevealed ? `url(${getCardImage()})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: card.isRevealed ? "transparent" : (card.team === "Red" ? "#ffdddd" : card.team === "Blue" ? "#ddddff" : "#eeeeee"),
        border: "1px solid black",
      }}
    >
      {!card.isRevealed && (
        <div className="text-center font-bold text-lg text-black">{card.word}</div>
      )}
    </motion.div>
  );
};

export default Card;
