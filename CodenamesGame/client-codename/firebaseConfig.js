import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database"; // אם אתה משתמש ב-Realtime Database
import { getFirestore } from "firebase/firestore"; // אם אתה משתמש ב-Firestore

const firebaseConfig = {
    apiKey: "AIzaSyBYiVKL47LOy7T-piEMQtkZTBHzl3ljrjg",
    authDomain: "codename-aaec0.firebaseapp.com",
    projectId: "codename-aaec0",
    storageBucket: "codename-aaec0.firebasestorage.app",
    messagingSenderId: "887660616518",
    appId: "1:887660616518:web:e2f1a0a8c203de45dee347",
    measurementId: "G-XT9DV2CFJD"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app); // לשימוש ב-Realtime Database
export const firestore = getFirestore(app); // לשימוש ב-Firestore
