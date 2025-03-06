import React from "react";
import { Link } from "react-router-dom";
import '/HomaPage.css'

const Home = () => {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Codenames</h1>
        <p>המשחק שמאתגר את המחשבה!</p>
      </header>

      <div className="home-actions">
        <Link to="/login" className="home-button">התחברות</Link>
        <Link to="/register" className="home-button">הרשמה</Link>
        <Link to="/game" className="home-button">התחל משחק</Link>
      </div>

      <footer className="home-footer">
        <p>© כל הזכויות שמורות - Codenames</p>
      </footer>
    </div>
  );
};

export default Home;
