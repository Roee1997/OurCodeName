import React, { useState } from "react";

const Card = ({ word, team }) => {
  const [revealed, setRevealed] = useState(false);

  // קביעת צבע הקלף לפי הצוות
  const getCardImage = () => {
    switch (team) {
      case "red":
        return "url('../assets/redteam.jpeg')"; // שנה את הנתיב לתמונה שלך
      case "blue":
        return "url('../assets/blueteam.jpeg')"; // שנה את הנתיב לתמונה שלך
      case "neutral":
        return "url('../assets/neutral.jpeg')"; // שנה את הנתיב לתמונה שלך
      case "black":
        return "url('../assets/assasin.jpg')"; // שנה את הנתיב לתמונה שלך
      default:
        return "bg-white";
    }
  };

  return (
    <div
      className={`w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 flex justify-center items-center rounded-lg shadow-lg cursor-pointer transition-all duration-300 hover:scale-105 transform`}
      onClick={() => setRevealed(true)} // עדכון מצב revealed בלחיצה
      style={{
        backgroundImage: revealed ? getCardImage() : "none", // הצגת התמונה רק לאחר הלחיצה
        backgroundSize: "cover", // התמונה ממלאת את כל הקונטיינר
        backgroundPosition: "center", // התמונה ממוקמת במרכז
      }}
    >
      {!revealed && (
        <div className="text-center font-bold text-lg text-black">{word}</div>
      )}
    </div>
  );
};

export default Card;