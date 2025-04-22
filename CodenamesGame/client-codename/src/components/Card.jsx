import { motion } from "framer-motion";
import React from "react";
import assassinImg from "../assets/assasin.jpg";
import blueTeamImg from "../assets/blueteam.jpeg";
import neutralImg from "../assets/neutral.jpeg";
import redTeamImg from "../assets/redteam.jpeg";
import "../css/Card.css";
import { updateCardInFirebase } from "../services/firebaseService";

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

  const handleClick = async () => {
    if (!canClick || isRevealed) return;

    // ✅ רק הסוכן של הקבוצה שבתור יכול ללחוץ
    if (userTeam !== currentTurn || isSpymaster) {
      console.warn("⛔ לא תורך או שאתה לוחש – לא ניתן לנחש");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5150/api/games/${gameId}/reveal/${cardID}`, {
        method: "PUT"
      });

      if (!res.ok) {
        console.error("❌ שגיאה בגילוי קלף בשרת");
        return;
      }

      await updateCardInFirebase(gameId, {
        ...card,
        isRevealed: true
      });

      if (onCardRevealed) onCardRevealed();
    } catch (error) {
      console.error("❌ שגיאה בגילוי קלף:", error);
    }
  };

  const hiddenStyle = {
    backgroundColor: "#ccc",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#333",
  };

  const revealedStyle = isRevealed
    ? {
        backgroundImage: `url(${getCardImage()})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : team === "Hidden"
    ? hiddenStyle
    : {
        backgroundColor:
          team === "Red"
            ? "#ffdddd"
            : team === "Blue"
            ? "#ddddff"
            : team === "Assassin"
            ? "#888888"
            : "#eeeeee",
      };

  return (
    <motion.div
      onClick={handleClick}
      initial={{ rotateY: 0 }}
      animate={{ rotateY: isRevealed ? 180 : 0 }}
      transition={{ duration: 0.6 }}
      className="card-wrapper"
    >
      <div className="card" style={revealedStyle}>
        {!isRevealed && (
          <div className="text-center font-bold text-lg text-black">{word}</div>
        )}
      </div>
    </motion.div>
  );
};

export default Card;
