// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-analytics.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { getFirestore, getDoc, doc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB8l98JoZyg6AYnylCG2IT9l59oB-a6chU",
    authDomain: "calendardatabase-efef9.firebaseapp.com",
    projectId: "calendardatabase-efef9",
    storageBucket: "calendardatabase-efef9.firebasestorage.app",
    messagingSenderId: "786544921040",
    appId: "1:786544921040:web:87365bc853c7fc080411d5",
    measurementId: "G-BFV2ZQ0DD0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth();
const db = getFirestore();

// DOM elements
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const calendarContainer = document.getElementById('calendar-container');
const formContainer = document.querySelector('.form-container');
const toggleToRegister = document.getElementById('toggleToRegister');
const toggleToLogin = document.getElementById('toggleToLogin');

onAuthStateChanged(auth, (user) => {
    const loggedInUserId = localStorage.getItem('loggedInUserId');

    if (user && loggedInUserId) {
        // Nascondi i form e mostra il calendario
        loginForm.style.display = 'none';
        registerForm.style.display = 'none';
        calendarContainer.style.display = 'block';

        // Ottieni i dati dell'utente dal database
        const docRef = doc(db, "user", loggedInUserId);
        getDoc(docRef)
            .then((docSnap) => {
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    document.getElementById('loggedUserName').innerHTML = userData.name;
                    document.getElementById('loggedUserEmail').innerHTML = userData.email;
                    document.getElementById('loggedUserSurname').innerHTML = userData.surname;
                } else {
                    console.log("No document found matching the ID!");
                }
            })
            .catch((error) => {
                console.error("Error getting document", error);
            });
    } else {
        // Mostra i form di login e registrazione se l'utente non è loggato
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        calendarContainer.style.display = 'none';
        console.log("User not logged in");
    }
});

// Gestione dei pulsanti per alternare i form
toggleToRegister.addEventListener('click', () => {
    formContainer.style.backgroundColor = 'rgb(53, 47, 79)';
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
    calendarContainer.style.display = 'none';
});

toggleToLogin.addEventListener('click', () => {
    formContainer.style.backgroundColor = 'darkslategray';
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
    calendarContainer.style.display = 'none';
});

const logoutButton = document.getElementById('logout');
logoutButton.addEventListener('click', () => {
    localStorage.removeItem('loggedInUserId');
    signOut(auth)
        .then(() => {
            window.location.href = "index.html";
        })
        .catch((error) => {
            console.error('Error Signing out:', error);
        });
});