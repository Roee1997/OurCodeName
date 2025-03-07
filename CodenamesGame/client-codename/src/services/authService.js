import { auth } from "../../firebaseConfig"; // ייבוא auth מ-firebaseConfig
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

// הרשמה
export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Firebase auth error:", error); // הצגת השגיאה האמיתית
    throw error; // להעביר את השגיאה הלאה כדי שהלקוח יקבל אותה
  }
};

// התחברות
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Firebase auth error:", error); // הצגת השגיאה האמיתית
    throw error; // להעביר את השגיאה הלאה כדי שהלקוח יקבל אותה
  }
};

// התנתקות
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error logging out:", error);
  }
};
