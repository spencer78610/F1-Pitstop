// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBMcsdYHTC9623s2KHXQ8lOEoXoOoqL0Bc",
  authDomain: "f1-pitstop-8590c.firebaseapp.com",
  projectId: "f1-pitstop-8590c",
  storageBucket: "f1-pitstop-8590c.firebasestorage.app",
  messagingSenderId: "705518502476",
  appId: "1:705518502476:web:b41c63d7c0d6f15d4d2ae9",
  measurementId: "G-E32FWJBFQT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

