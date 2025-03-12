import { auth } from "../../firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

const API_BASE_URL = "http://localhost:5150/api/users"; // ✅ Adjust for your API

// 🔹 Register User (Firebase + SQL Server)
export const registerUser = async (username, email, password) => {
  try {
    // 🔹 Step 1: Register user in Firebase
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("✅ Firebase user created:", user.uid);

    // 🔹 Step 2: Send user data to SQL Server
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        UserID: user.uid,  // 🔹 Firebase User ID
        Username: username, // 🔹 Custom username from input
        Email: email
      }),
    });

    if (!response.ok) {
      throw new Error("❌ Failed to register user in SQL Server.");
    }

    console.log("✅ User registered in SQL Server!");
    return user;

  } catch (error) {
    console.error("❌ Firebase auth error:", error);
    throw error;
  }
};

// 🔹 Login User
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Firebase auth error:", error);
    throw error;
  }
};

// 🔹 Logout User
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error logging out:", error);
  }
};
