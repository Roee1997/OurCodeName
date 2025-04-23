import React, { useState } from 'react';
import { loginUser } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const user = await loginUser(email, password);
      console.log('✅ התחברות מוצלחת:', user);
      setSuccess('✅ התחברת בהצלחה! מעביר אותך ללובי...');
      setTimeout(() => navigate('/Lobby'), 1500);
    } catch (error) {
      console.error("❌ שגיאה בהתחברות:", error.code);
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
          setError("נראה שעשית יותר מדי ניסיונות. נסה שוב מאוחר יותר.");
          break;
        default:
          setError("שגיאה בהתחברות. נסה שוב מאוחר יותר.");
      }
    }

    setLoading(false);
  };

  return (
    <div>
      <div className="relative z-10 bg-gradient-to-r from-gray-800 via-gray-900 to-black p-8 rounded-xl shadow-2xl w-96 mx-auto mt-12">
        <h2 className="text-3xl font-bold text-center mb-6 text-white drop-shadow-md">התחברות</h2>

        {error && <p className="bg-red-100 text-red-700 border border-red-400 px-4 py-2 rounded mb-4 text-center" dir="rtl">{error}</p>}
        {success && <p className="bg-green-100 text-green-700 border border-green-400 px-4 py-2 rounded mb-4 text-center" dir="rtl">{success}</p>}

        <form onSubmit={handleLogin}>
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold rounded-lg shadow-lg hover:bg-gradient-to-l hover:from-orange-500 hover:to-yellow-500 disabled:bg-gray-500"
          >
            {loading ? "מתחבר..." : "התחבר"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-4">
          לא רשום עדיין? <Link to="/register" className="text-yellow-400 font-semibold hover:underline">הרשם כאן</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;