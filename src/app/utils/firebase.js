// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE,
  authDomain: "blog-42097.firebaseapp.com",
  projectId: "blog-42097",
  storageBucket: "blog-42097.appspot.com",
  messagingSenderId: "162278416786",
  appId: "1:162278416786:web:2e7028e452fe0e4049214b",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
