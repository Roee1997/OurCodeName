import React, { useState } from 'react';
import { loginUser } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await loginUser(email, password);
      console.log('✅ התחברות מוצלחת:', user);
      alert('ההתחברות הצליחה!');
      navigate('/Lobby');
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
          setError("נראה שעשית יותר מדי ניסיונות התחברות. נסה שוב מאוחר יותר.");
          break;
        default:
          setError("שגיאה בהתחברות. נסה שוב מאוחר יותר.");
      }
    }

    setLoading(false);
  };

  return (
    <div >
      {/* תוכן הטופס */}
      <div className="relative z-10 bg-gradient-to-r from-gray-800 via-gray-900 to-black p-8 rounded-xl shadow-2xl w-96 mx-auto mt-12">
        <h2 className="text-3xl font-bold text-center mb-6 text-white drop-shadow-md">
          התחברות
        </h2>
        
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        
        <form onSubmit={handleLogin}>
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

export default Login;
