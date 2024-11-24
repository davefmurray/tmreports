import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyANOlZTnVmwIonGOHDiY0zYKUESrIqCw5U",
  authDomain: "tm-plus.firebaseapp.com",
  projectId: "tm-plus",
  storageBucket: "tm-plus.appspot.com",
  messagingSenderId: "953090037316",
  appId: "1:953090037316:web:d310b202a0d519685d4e11",
  measurementId: "G-SJMJ4N5YFB",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
