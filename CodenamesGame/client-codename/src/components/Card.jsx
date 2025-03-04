import React, { useState } from "react";

const Card = ({ word, team }) => {
  const [revealed, setRevealed] = useState(false);

  return (
    <div
      className={`card ${team} ${revealed ? "revealed" : ""}`}
      onClick={() => setRevealed(true)}  // עדכון מצב revealed בלחיצה
    >
      {word}  {/* המילה תמיד מוצגת */}
    </div>
  );
};

export default Card;