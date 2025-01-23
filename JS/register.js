// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB8l98JoZyg6AYnylCG2IT9l59oB-a6chU",
    authDomain: "calendardatabase-efef9.firebaseapp.com",
    projectId: "calendardatabase-efef9",
    storageBucket: "calendardatabase-efef9.firebasestorage.app",
    messagingSenderId: "786544921040",
    appId: "1:786544921040:web:3834dd33154276310411d5",
    measurementId: "G-QHT0TNGM5Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

//Submit button
const form = document.getElementById('loginForm');
form.addEventListener("submit", function (event) {
    event.preventDefault();  // Previeni il comportamento predefinito del submit del form

    // Inputs
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    console.log('Email:', email);
    console.log('Password:', password);

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            alert("Account creato!");
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorMessage);
        });
});