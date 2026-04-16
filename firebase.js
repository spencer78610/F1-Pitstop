import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBMcsdYHTC9623s2KHXQ8lOEoXoOoqL0Bc",
  authDomain: "f1-pitstop-8590c.firebaseapp.com",
  projectId: "f1-pitstop-8590c",
  storageBucket: "f1-pitstop-8590c.firebasestorage.app",
  messagingSenderId: "705518502476",
  appId: "1:705518502476:web:b41c63d7c0d6f15d4d2ae9",
  measurementId: "G-E32FWJBFQT"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);