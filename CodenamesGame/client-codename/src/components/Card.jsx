import { motion } from "framer-motion";
import React from "react";
import assassinImg from "../assets/assasin.jpg";
import blueTeamImg from "../assets/blueteam.jpeg";
import neutralImg from "../assets/neutral.jpeg";
import redTeamImg from "../assets/redteam.jpeg";

const Card = ({ word, team, revealed, onReveal }) => {
  const getCardImage = () => {
    switch (team) {
      case "red":
        return redTeamImg;
      case "blue":
        return blueTeamImg;
      case "neutral":
        return neutralImg;
      case "black":
        return assassinImg;
      default:
        return "";
    }
  };

  return (
    <motion.div
      className="w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 flex justify-center items-center rounded-lg shadow-lg cursor-pointer transition-all duration-300 hover:scale-105"
      onClick={onReveal}
      initial={{ rotateY: 0 }}
      animate={{ rotateY: revealed ? 180 : 0 }}
      transition={{ duration: 0.6 }}
      style={{
        backgroundImage: revealed ? `url(${getCardImage()})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: revealed ? "transparent" : (team === "red" ? "#ffdddd" : team === "blue" ? "#ddddff" : "#eeeeee"),
        border: "1px solid black",
      }}
    >
      {!revealed && (
        <div className="text-center font-bold text-lg text-black">{word}</div>
      )}
    </motion.div>
  );
};

export default Card;
