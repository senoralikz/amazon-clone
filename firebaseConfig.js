// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCHEnob1vdFUO-Z-dmMbrb520qfyKdwzs0",
  authDomain: "clone-47021.firebaseapp.com",
  projectId: "clone-47021",
  storageBucket: "clone-47021.appspot.com",
  messagingSenderId: "475860285971",
  appId: "1:475860285971:web:995ab57d85a6c364e65de6",
  measurementId: "G-5BNLR27ZEC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);