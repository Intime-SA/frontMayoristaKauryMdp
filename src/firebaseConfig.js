// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  signInWithEmailAndPassword,
  signOut,
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";

import { getFirestore } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC82Xmj6-MfN1lpnmabdANaU4c9ZNjpPh4",
  authDomain: "mayoristakaurymdp.firebaseapp.com",
  projectId: "mayoristakaurymdp",
  storageBucket: "mayoristakaurymdp.appspot.com",
  messagingSenderId: "1059207647185",
  appId: "1:1059207647185:web:e5c8298f7225cd48585af0",
  measurementId: "G-ST43E089JF",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const db = getFirestore(app);

export const onSingIn = async ({ email, password }) => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const logOut = () => {
  signOut(auth);
  console.log("Cerro Sesion");
};

let googleProvider = new GoogleAuthProvider();

export const loginGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    return res;
    console.log(res);
  } catch (error) {}
};

export const signUp = async ({ email, password }) => {
  try {
    let res = await createUserWithEmailAndPassword(auth, email, password);
    console.log(res);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const forgotPassword = async (email) => {
  await sendPasswordResetEmail(auth, email);
};
