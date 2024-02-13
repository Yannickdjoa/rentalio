// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "rentalio-c4437.firebaseapp.com",
  projectId: "rentalio-c4437",
  storageBucket: "rentalio-c4437.appspot.com",
  messagingSenderId: "849155434307",
  appId: "1:849155434307:web:c75d364fa99350febeb1f6"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);