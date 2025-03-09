import React, { useState } from "react";
import { registerUser } from "../services/authService"; // ודא שהנתיב נכון
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom"; // הוספת useNavigate להפניה
import "../css/auth.css"; // חיבור ה-CSS

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // ✅ הוספת ניהול שגיאות
  const [loading, setLoading] = useState(false); // ✅ הוספת ניהול מצב טעינה
  const navigate = useNavigate(); // הוספת ה-Navigate להפניה

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
  
    try {
      const user = await registerUser(email, password);
      console.log('✅ משתמש נרשם בהצלחה:', user);
      alert('ההרשמה הצליחה!');
      navigate('/login'); // לאחר הרשמה, מנווטים לעמוד ההתחברות
      navigate('/Lobby');
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
    <div >
      {/* תוכן הטופס */}
      <div className="relative z-10 bg-gradient-to-r from-gray-800 via-gray-900 to-black p-8 rounded-xl shadow-2xl w-96 mx-auto mt-12">
        <h2 className="text-3xl font-bold text-center mb-6 text-white drop-shadow-md">
          הרשמה
        </h2>
        
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label className="block text-gray-300 font-medium mb-2" htmlFor="email">אימייל</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-300 font-medium mb-2" htmlFor="password">סיסמה</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold rounded-lg shadow-lg hover:bg-gradient-to-l hover:from-orange-500 hover:to-yellow-500 disabled:bg-gray-500 transform hover:scale-105 transition-all"
          >
            {loading ? "נרשם..." : "הירשם"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-4">
          כבר יש לך חשבון? <Link to="/login" className="text-yellow-400 font-semibold hover:underline">התחבר כאן</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;

