import React, { useState } from "react";
import { registerUser } from "../services/authService"; 
import { Link, useNavigate } from "react-router-dom"; 
import "../css/auth.css"; 

const RegisterForm = () => {
  const [username, setUsername] = useState(""); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); 
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); 

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const user = await registerUser(username, email, password);
      console.log("✅ User registered successfully:", user);
      setSuccess("✅ נרשמת בהצלחה! מעביר ללובי...");
      setTimeout(() => navigate("/Lobby"), 1500);

    } catch (error) {
      console.error("❌ Registration error:", error.message);

      if (error.message.includes("כינוי כבר קיים")) {
        setError("⚠️ הכינוי כבר קיים במערכת. נסה כינוי אחר.");
      } else if (error.message.includes("האימייל כבר קיים")) {
        setError("⚠️ האימייל כבר קיים במערכת. נסה להתחבר.");
      } else {
        setError("❌ שגיאה בהרשמה. נסה שוב מאוחר יותר.");
      }
    }

    setLoading(false);
  };

  return (
    <div>
      <div className="relative z-10 bg-gradient-to-r from-gray-800 via-gray-900 to-black p-8 rounded-xl shadow-2xl w-96 mx-auto mt-12">
        <h2 className="text-3xl font-bold text-center mb-6 text-white drop-shadow-md">הרשמה</h2>

        {error && <p className="bg-red-100 text-red-700 border border-red-400 px-4 py-2 rounded mb-4 text-center" dir="rtl">{error}</p>}
        {success && <p className="bg-green-100 text-green-700 border border-green-400 px-4 py-2 rounded mb-4 text-center" dir="rtl">{success}</p>}

        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label className="block text-gray-300 font-medium mb-2" htmlFor="username">כינוי</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 font-medium mb-2" htmlFor="email">אימייל</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
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
              className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white"
            />
          </div>

          <button type="submit" disabled={loading} className="w-full py-3 bg-yellow-500 text-white font-semibold rounded-lg shadow-lg">
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

export default RegisterForm;
