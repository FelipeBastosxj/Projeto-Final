// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithRedirect, getRedirectResult } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAn9BhHnUIlGkbCsJy7xnfJlDP3biQKevU",
    authDomain: "blue-inventory-car.firebaseapp.com",
    projectId: "blue-inventory-car",
    storageBucket: "blue-inventory-car.appspot.com",
    messagingSenderId: "49385962525",
    appId: "1:49385962525:web:7d6d089ac45189a61bdaf4",
    measurementId: "G-E9T5H9FPXW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const autenticacao = getAuth()
const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

const db = getFirestore(app);

//signInWithRedirect(autenticacao, provider);


export { autenticacao, provider, signInWithRedirect, GoogleAuthProvider, getRedirectResult, db }