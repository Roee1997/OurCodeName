import React, { useState } from 'react';
import {  registerUser} from '../services/authService';
import AuthForm from './AuthForm';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (email, password) => {
    await  registerUser(email, password);
  };

  return (
    <div>
      <h2>Register</h2>
      <AuthForm
        onSubmit={handleRegister}
        buttonText="Register"
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
      />
    </div>
  );
};

export default Register;