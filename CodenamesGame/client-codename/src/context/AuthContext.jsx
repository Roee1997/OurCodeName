import { onAuthStateChanged, signOut } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../../firebaseConfig";

// יצירת קונטקסט עבור המשתמש המחובר
const AuthContext = createContext();

// ספק (Provider) שמנהל את המשתמש והטעינה הכללית של האפליקציה
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);       // מצב המשתמש המחובר
  const [loading, setLoading] = useState(true); // טעינה עד לזיהוי מצב התחברות

  // מאזין לשינויים בהתחברות המשתמש (כניסה/יציאה)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe(); // ניקוי מאזין ברגע שהקומפוננטה יורדת
  }, []);

  // מתנתק מהחשבון ומנקה את המשתמש מה־state
  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  // ספק את המשתמש, מצב טעינה, ופונקציית יציאה לשאר האפליקציה
  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {!loading && children} {/* מוצג רק כשסיום טעינה */}
    </AuthContext.Provider>
  );
};

// hook מותאם אישי כדי להשתמש במידע על המשתמש מכל קומפוננטה
export const useAuth = () => useContext(AuthContext);
