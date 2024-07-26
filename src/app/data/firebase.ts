// src/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBb3gjWef_eTfOfvpHiz3KgHoiEIKIMFz0",
  authDomain: "react-notes-857b8.firebaseapp.com",
  projectId: "react-notes-857b8",
  storageBucket: "react-notes-857b8.appspot.com",
  messagingSenderId: "193152606764",
  appId: "1:193152606764:web:2338dfad75dc4b5fe3e789"
};

let app;
let auth: Auth;
let db: Firestore;

if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    console.log("Firebase initialized successfully");
  } catch (error) {
    console.error("Error initializing Firebase:", error);
  }
} else {
  app = getApp();
  auth = getAuth(app);
  db = getFirestore(app);
}

export { auth, db };