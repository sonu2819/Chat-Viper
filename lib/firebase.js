import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyA3Uu-9EH0FpwFCWJ2BNMjlrbvcC9ZXTds",
  authDomain: "rand-chat-d0a41.firebaseapp.com",
  databaseURL: "https://rand-chat-d0a41-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "rand-chat-d0a41",
  storageBucket: "rand-chat-d0a41.firebasestorage.app",
  messagingSenderId: "473341896381",
  appId: "1:473341896381:web:83aeefc5972fd59ff8b9d4",
  measurementId: "G-Z3LS3FGDV3"
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);