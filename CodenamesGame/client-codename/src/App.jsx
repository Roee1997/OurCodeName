import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Game from "./pages/Game";
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './css/App.css';

function App() {
  const [count, setCount] = useState(0)

  return (
    
      <div className="container">
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
          <Route path="/game" element={<Game />} />
        </Routes>
      </div>
    
  )
}

export default App
