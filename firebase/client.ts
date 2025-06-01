import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyCGxQfwZZcyO6mY5Qs3psfqvduvIxb-n6Q",
  authDomain: "kazicoach-79eba.firebaseapp.com",
  projectId: "kazicoach-79eba",
  storageBucket: "kazicoach-79eba.firebasestorage.app",
  messagingSenderId: "871146951018",
  appId: "1:871146951018:web:c9bb38de557bda9d83d513",
  measurementId: "G-T1JVXJ1KSQ"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const firebaseAuth = getAuth(app);
export const firebaseDb = getFirestore(app);