import React, { useState } from "react";
import { registerUser } from "../services/authService"; // ודא שהנתיב נכון
import { Link } from "react-router-dom";
import "../css/auth.css"; // חיבור ה-CSS

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // ✅ הוספת ניהול שגיאות
  const [loading, setLoading] = useState(false); // ✅ הוספת ניהול מצב טעינה

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
  
    try {
      const user = await registerUser(email, password);
      console.log('✅ משתמש נרשם בהצלחה:', user);
      alert('ההרשמה הצליחה!');
    } catch (error) {
      console.error("❌ שגיאה בהרשמה:", error.code);
  
      if (error.code === "auth/email-already-in-use") {
        setError("⚠️ האימייל כבר קיים .");
      } else if (error.code === "auth/weak-password") {
        setError("⚠️ הסיסמה חייבת להיות לפחות 6 תווים.");
      } else {
        setError("❌ שגיאה בהרשמה. נסה שוב מאוחר יותר.");
      }
    }
  
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>הרשמה</h2>
        {error && <p className="error-message">{error}</p>} {/* ✅ הצגת שגיאות */}
        <form onSubmit={handleRegister}>
          <input
            type="email"
            placeholder="אימייל"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="סיסמה"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "נרשם..." : "הירשם"}
          </button>
        </form>
        <p>כבר יש לך חשבון? <Link to="/login">התחבר כאן</Link></p>
      </div>
    </div>
  );
};

export default RegisterPage;
