import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../../firebaseConfig"; // ייבוא auth מ-firebaseConfig
import { onAuthStateChanged, signOut } from "firebase/auth";

// יצירת הקונטקסט
const AuthContext = createContext();

// ספק (Provider) שמנהל את המשתמש המחובר
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // מאזין לשינויים במשתמש המחובר
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe(); // הפסקת ההאזנה ביציאה
  }, []);

  // פונקציה ליציאה מהחשבון
  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {!loading && children} {/* שים לב לזה */}
    </AuthContext.Provider>
  );
};

// שימוש ב-hook לגישה מהירה למידע על המשתמש
export const useAuth = () => useContext(AuthContext);