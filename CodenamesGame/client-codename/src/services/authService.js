import {
  createUserWithEmailAndPassword,
  deleteUser,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from "firebase/auth";
import { auth } from "../../firebaseConfig";

const API_BASE_URL = "http://localhost:5150/api/users"; // כתובת ה־API של צד השרת

// רושם משתמש חדש: בודק כינוי, יוצר ב־Firebase, שומר במסד הנתונים
export async function registerUser(username, email, password) {
  try {
    // בדיקת זמינות כינוי במסד הנתונים
    const usernameCheckResponse = await fetch(`${API_BASE_URL}/check-username/${username}`);

    if (!usernameCheckResponse.ok) {
      const errorData = await usernameCheckResponse.json();
      throw new Error(errorData.message || "הכינוי כבר תפוס, בחר כינוי אחר.");
    }

    // יצירת משתמש ב־Firebase
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("משתמש נוצר ב־Firebase:", user.uid);

    // עדכון שם תצוגה של המשתמש
    await updateProfile(user, {
      displayName: username
    });
    console.log("שם תצוגה עודכן:", username);

    // רישום המשתמש במסד הנתונים של SQL Server
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        UserID: user.uid,
        Username: username,
        Email: email,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();

      // אם השמירה ב־SQL נכשלה – מוחק את המשתמש מ־Firebase
      await deleteUser(user);
      throw new Error(errorData.message || "נכשלה הרשמת המשתמש במסד הנתונים.");
    }

    console.log("המשתמש נשמר במסד הנתונים.");
    return user;

  } catch (error) {
    console.error("שגיאה בהרשמה:", error.message);

    // אם נוצר משתמש ב־Firebase אך SQL נכשלה – מוחק את המשתמש
    if (auth.currentUser) {
      await deleteUser(auth.currentUser);
      console.log("המשתמש נמחק מ־Firebase עקב שגיאת שרת.");
    }

    // טיפול במקרה של אימייל קיים
    if (error.code === "auth/email-already-in-use") {
      throw new Error("האימייל כבר קיים במערכת. נסה להתחבר.");
    }

    // טיפול במקרה של כינוי כפול
    if (error.message.includes("כינוי כבר קיים")) {
      throw new Error("הכינוי כבר קיים במערכת. נסה כינוי אחר.");
    }

    throw error;
  }
}

// מבצע התחברות של המשתמש עם אימייל וסיסמה
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("שגיאת התחברות Firebase:", error);
    throw error;
  }
};

// מנתק את המשתמש מהמערכת
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("שגיאה ביציאה:", error);
  }
};
