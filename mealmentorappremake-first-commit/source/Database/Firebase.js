// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCSsbtnX_-dBSH0A31_ddmY8HG8cfYSkLk",
  authDomain: "mealmentor-ec306.firebaseapp.com",
  projectId: "mealmentor-ec306",
  storageBucket: "mealmentor-ec306.appspot.com",
  messagingSenderId: "429332334542",
  appId: "1:429332334542:web:8f7449116f99f7ffb20d9f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const dataBase = getFirestore(app);
