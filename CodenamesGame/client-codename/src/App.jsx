import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from './context/AuthContext';
import './css/App.css';
import Friends from "./pages/Friends";
import Game from "./pages/Game";
import GameLobby from "./pages/GameLobby.jsx";
import Home from "./pages/Home";
import LobbyPage from "./pages/Lobby";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

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
            <Route path="/game/:gameId" element={<Game />} /> {/* ✅ תיקון כאן */}
            <Route path="/game-lobby/:gameId" element={<GameLobby />} />
            <Route path="/friends" element={<Friends />} />
          </Route>

          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;