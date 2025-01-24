// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

// Configurazione di Firebase
const firebaseConfig = {
    apiKey: "AIzaSyB8l98JoZyg6AYnylCG2IT9l59oB-a6chU",
    authDomain: "calendardatabase-efef9.firebaseapp.com",
    projectId: "calendardatabase-efef9",
    storageBucket: "calendardatabase-efef9.firebasestorage.app",
    messagingSenderId: "786544921040",
    appId: "1:786544921040:web:87365bc853c7fc080411d5",
    measurementId: "G-BFV2ZQ0DD0"
};

// Inizializza Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

// Funzione per mostrare i messaggi
function showMessage(message, divId){
    var messageDiv = document.getElementById(divId);
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;
    setTimeout(function(){
        messageDiv.style.opacity = 0;
    }, 5000);
}

// Funzione per mostrare il calendario e nascondere i form
function showCalendar() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const formContainer = document.querySelector('.form-container');
    const calendarContainer = document.getElementById('calendar-container');

    // Nascondiamo i form
    loginForm.style.display = 'none';
    registerForm.style.display = 'none';
    formContainer.style.display = 'none';
    
    // Mostriamo il calendario
    calendarContainer.style.display = 'block';
}

// Registrazione
const signUp = document.getElementById('submitRegister');
signUp.addEventListener('click', (event) => {
    event.preventDefault();

    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const name = document.getElementById('registerName').value;
    const surname = document.getElementById('registerSurname').value;

    if (!email || !password || !name || !surname) {
        showMessage('Please fill in all fields!', 'signUpMessage');
        return;
    }

    if (password.length < 6) {
        showMessage('Password must be at least 6 characters!', 'signUpMessage');
        return;
    }

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            const userData = { email, password, name, surname };

            showMessage('Account Created Successfully!', 'signUpMessage');
            const docRef = doc(db, "user", user.uid);
            setDoc(docRef, userData)
                .then(() => {
                    showCalendar();
                })
                .catch((error) => {
                    console.error("Error writing document:", error);
                });
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error("Error code:", errorCode);
            console.error("Error message:", errorMessage);
            if (errorCode === 'auth/email-already-in-use') {
                showMessage('Email Address Already Exists!', 'signUpMessage');
            } else {
                showMessage('Unable to create User: ' + errorMessage, 'signUpMessage');
            }
        });
});

// Login
const signIn = document.getElementById('submitLogin');
signIn.addEventListener('click', (event) =>{
    event.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) =>{
        showMessage('Login successful', 'signInMessage');
        const user = userCredential.user;
        localStorage.setItem('loggedInUserId', user.uid);
        showCalendar();
    })
    .catch((error) =>{
        const errorCode = error.code;
        if(errorCode === 'auth/invalid-credential'){
            showMessage('Incorrect Email or Password', 'signInMessage');
        } else {
            showMessage('Account does not exist', 'signInMessage');
        }
    });
});