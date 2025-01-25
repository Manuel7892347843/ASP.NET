// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { getFirestore, setDoc, getDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

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

// Elementi del DOM
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const calendarContainer = document.getElementById('calendar-container');
const formContainer = document.querySelector('.form-container');
const toggleToRegister = document.getElementById('toggleToRegister');
const toggleToLogin = document.getElementById('toggleToLogin');
const logoutButton = document.getElementById('logout');

// Funzione per mostrare messaggi
function showMessage(message, divId) {
    const messageDiv = document.getElementById(divId);
    if (!messageDiv) return;

    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;
    setTimeout(() => {
        messageDiv.style.opacity = 0;
    }, 5000);
}

// Funzione per aggiornare la UI in base allo stato di autenticazione
function updateUIForAuthenticatedUser(user) {
    if (user) {
        loginForm.style.display = 'none';
        registerForm.style.display = 'none';
        formContainer.style.display = 'none';
        calendarContainer.style.display = 'block';
        logoutButton.style.display = 'block';

        const docRef = doc(db, "user", user.uid);
        getDoc(docRef).then((docSnap) => {
            if (docSnap.exists()) {
                const userData = docSnap.data();
                document.getElementById('loggedUserName').innerText = userData.name || '';
                document.getElementById('loggedUserEmail').innerText = userData.email || '';
                document.getElementById('loggedUserSurname').innerText = userData.surname || '';
            } else {
                console.log("No user data found!");
            }
        }).catch((error) => {
            console.error("Error fetching user data:", error);
        });
    } else {
        showLoginForm();
    }
}

// Funzione per mostrare il form di login
function showLoginForm() {
    formContainer.style.backgroundColor = 'darkslategray';
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
    calendarContainer.style.display = 'none';
    logoutButton.style.display = 'none';
}

// Funzione per mostrare il form di registrazione
function showRegisterForm() {
    formContainer.style.backgroundColor = 'rgb(53, 47, 79)';
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
    calendarContainer.style.display = 'none';
    logoutButton.style.display = 'none';
}

// Listener per alternare i form
toggleToRegister.addEventListener('click', showRegisterForm);
toggleToLogin.addEventListener('click', showLoginForm);

// Registrazione utente
document.getElementById('submitRegister').addEventListener('click', (event) => {
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
            const userData = { email, name, surname };

            return setDoc(doc(db, "user", user.uid), userData);
        })
        .then(() => {
            showMessage('Account Created Successfully!', 'signUpMessage');
            updateUIForAuthenticatedUser(auth.currentUser);
        })
        .catch((error) => {
            if (error.code === 'auth/email-already-in-use') {
                showMessage('Email Address Already Exists!', 'signUpMessage');
            } else {
                showMessage('Unable to create user: ' + error.message, 'signUpMessage');
            }
        });
});

// Login utente
document.getElementById('submitLogin').addEventListener('click', (event) => {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            showMessage('Login successful', 'signInMessage');
            updateUIForAuthenticatedUser(userCredential.user);
        })
        .catch((error) => {
            if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
                showMessage('Incorrect Email or Password', 'signInMessage');
            } else {
                showMessage('Error: ' + error.message, 'signInMessage');
            }
        });
});

// Logout utente
logoutButton.addEventListener('click', () => {
    signOut(auth)
        .then(() => {
            localStorage.removeItem('loggedInUserId');
            window.location.href = 'index.html';
        })
        .catch((error) => {
            console.error('Error signing out:', error);
        });
});

// Monitoraggio dello stato di autenticazione
onAuthStateChanged(auth, (user) => {
    updateUIForAuthenticatedUser(user);
});