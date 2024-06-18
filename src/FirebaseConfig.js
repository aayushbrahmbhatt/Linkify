// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCqY5j3ypZUuuX-uAXLrLg2VrSIMOFXf9A",
    authDomain: "linkify-5fe79.firebaseapp.com",
    projectId: "linkify-5fe79",
    storageBucket: "linkify-5fe79.appspot.com",
    messagingSenderId: "20293264371",
    appId: "1:20293264371:web:a20afd19bac38177e22886",
    measurementId: "G-7WKK9VXN5Q"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
export { auth, app, db, storage }; //using export so we can use this in other files
