
// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  "projectId": "litlens-98olq",
  "appId": "1:606100820145:web:3e0ccecfe51edc78161290",
  "storageBucket": "litlens-98olq.firebasestorage.app",
  "apiKey": "AIzaSyA9o_3IJAvVyaPBV5pV5hHD_tjanquSahw",
  "authDomain": "litlens-98olq.firebaseapp.com",
  "messagingSenderId": "606100820145"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
