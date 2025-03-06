import React, { useState } from 'react';
import { loginUser } from '../services/authService';
import AuthForm from './AuthForm';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault(); // מונע רענון דף אוטומטי
    try {
      await loginUser(email, password); // מבצע את ההתחברות
      alert('ההתחברות הצליחה!'); // הודעה על הצלחה
    } catch (error) {
      console.error('Error logging in:', error.message);
      alert('אירעה שגיאה בהתחברות.'); // הודעת שגיאה
    }
  };

  return (
    <div>
      <h2>התחברות</h2>
      <AuthForm
        onSubmit={handleLogin}  // הפונקציה המתבצעת כאשר הטופס נשלח
        buttonText="התחבר"  // שם כפתור התחברות
        email={email}  // משתנה ה-email
        setEmail={setEmail}  // פונקציה לעדכון ה-email
        password={password}  // משתנה ה-password
        setPassword={setPassword}  // פונקציה לעדכון ה-password
      />
    </div>
  );
};

export default Login;
