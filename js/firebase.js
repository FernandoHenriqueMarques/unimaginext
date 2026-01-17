import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA-awjWntNjEiMZM-RIM_93xLpEA7icYHg",
  authDomain: "unimaginext.firebaseapp.com",
  projectId: "unimaginext",
  storageBucket: "unimaginext.firebasestorage.app",
  messagingSenderId: "795705167282",
  appId: "1:795705167282:web:3a25ac6dc1f71e6f55a8ab"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
