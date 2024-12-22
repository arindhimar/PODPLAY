import { initializeApp } from "firebase/app";
import { getDatabase, serverTimestamp } from "firebase/database";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCdppEIMRyOX-ZVT_Q82oCfhWeSJVwR1G0",
  authDomain: "podplay-4293.firebaseapp.com",
  databaseURL: "https://podplay-4293-default-rtdb.firebaseio.com",
  projectId: "podplay-4293",
  storageBucket: "podplay-4293.firebasestorage.app",
  messagingSenderId: "404516144613",
  appId: "1:404516144613:web:e0bf2491cddfebde63db0c",
  measurementId: "G-RGE61F15V2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and other Firebase services
const database = getDatabase(app);

// Export necessary Firebase utilities
export { database, serverTimestamp };
