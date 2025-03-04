import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home">
      <h1>ברוך הבא למשחק שם קוד!</h1>
      <p>לחץ על הכפתור כדי להתחיל משחק חדש.</p>
      <Link to="/game">
        <button className="start-button">התחל משחק</button>
      </Link>
    </div>
  );
};

export default Home;
