import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from './context/AuthContext'; // חשוב לוודא שה-AuthProvider מיובא כראוי
import Home from "./pages/Home";
import Game from "./pages/Game";
import LobbyPage from "./pages/Lobby";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute"; // הקומפוננטה ששומרת על עמודים מוגנים
import './css/App.css';
import Friends from "./pages/Friends";

function App() {
  return (
    <AuthProvider> {/* עטוף את כל האפליקציה ב-AuthProvider */}
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/lobby" element={<LobbyPage />} />
            <Route path="/game" element={<Game />} />
            <Route path="/friends" element={<Friends />} />
          </Route>
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;