import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // אם יש לך AuthContext שמנהל את המידע על המשתמש

const Lobby = () => {
  const { user, logout } = useAuth(); // גישה למידע על המשתמש המחובר

  if (!user) {
    // אם המשתמש לא מחובר, להחזיר אותו לדף הבית או להתחברות
    return <p>יש להתחבר כדי לגשת לדף זה.</p>;
  }

  return (
    <div className="lobby-container">
      <header className="lobby-header">
        <h1>ברוך הבא, {user.displayName || user.email}!</h1>
        <p>בחר איך להמשיך</p>
      </header>

      <div className="lobby-actions">
        <Link to="/game" className="lobby-button">התחל משחק חדש</Link>
       
      </div>

      <footer className="lobby-footer">
        <p>© כל הזכויות שמורות - Codenames</p>
        <button onClick={logout} className="logout-button">התנתק</button>
      </footer>
    </div>
  );
};

export default Lobby;