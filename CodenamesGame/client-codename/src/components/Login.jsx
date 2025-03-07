import React, { useState } from 'react';
import { loginUser } from '../services/authService';
import AuthForm from './AuthForm';
import { useNavigate } from 'react-router-dom'; // ייבוא useNavigate
import { Link } from 'react-router-dom'; // ייבוא Link עבור קישור לעמוד ההרשמה
import '../css/auth.css'; // חיבור ה-CSS

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // יצירת ה-navigate

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await loginUser(email, password);
      console.log('✅ התחברות מוצלחת:', user);
      alert('ההתחברות הצליחה!');

      // מעבר לדף הלובי אחרי התחברות מוצלחת
      navigate('/Lobby'); // כאן אנחנו עושים את המעבר לדף הלובי
    } catch (error) {
      console.error("❌ שגיאה בהתחברות:", error.code);

      // טיפול בשגיאות לפי קוד שגיאה
      switch (error.code) {
        case "auth/wrong-password":
          setError("סיסמה שגויה. נסה שוב.");
          break;
        case "auth/user-not-found":
          setError("המשתמש לא קיים.");
          break;
        case "auth/invalid-credential":
          setError("אימייל או סיסמה שגויים.");
          break;
        case "auth/too-many-requests":
          setError("נראה שעשית יותר מדי ניסיונות התחברות. נסה שוב מאוחר יותר.");
          break;
        default:
          setError("שגיאה בהתחברות. נסה שוב מאוחר יותר.");
      }
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>התחברות</h2>
        {error && <p className="error-message">{error}</p>}
        <AuthForm
          onSubmit={handleLogin}
          buttonText={loading ? "מתחבר..." : "התחבר"}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          disabled={loading} // חוסם את הכפתור בזמן טעינה
        />
         <p>לא רשום עדיין? <Link to="/register">הרשם כאן</Link></p> {/* קישור להרשמה */}
      </div>
    </div>
  );
};

export default Login;