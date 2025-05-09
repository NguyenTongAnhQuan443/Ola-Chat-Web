// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBNfDb_8qugsABsUG248l_-vGXRyp4FBlA",
  authDomain: "ola-chat-93b40.firebaseapp.com",
  projectId: "ola-chat-93b40",
  storageBucket: "ola-chat-93b40.firebasestorage.app",
  messagingSenderId: "586464898832",
  appId: "1:586464898832:web:a839a30bd067c05ff3bf95",
  measurementId: "G-GRDEP21EEL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { messaging, getToken, onMessage };
