// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-analytics.js";
import { getAuth, onAuthStateChanged, signOut, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
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

// Funzione per controllare se l'utente è loggato
function checkLogin() {
    const loggedInUserId = localStorage.getItem('loggedInUserId');

    if (loggedInUserId) {
        const docRef = doc(db, "user", loggedInUserId);
        getDoc(docRef).then((docSnap) => {
            if (docSnap.exists()) {
                const userData = docSnap.data();
                document.getElementById('loggedUserName').innerHTML = userData.name;
                document.getElementById('loggedUserEmail').innerHTML = userData.email;
                document.getElementById('loggedUserSurname').innerHTML = userData.surname;
                hideLoginPopup();
            } else {
                console.log("No document found matching the id!");
            }
        }).catch((error) => {
            console.log("Error getting document");
        });
    } else {
        showLoginPopup(); // Mostra il popup di login
    }
}

// Funzione per mostrare il popup di login
function showLoginPopup() {
    document.getElementById('login-popup').style.display = 'block';
}

// Funzione per nascondere il popup di login
function hideLoginPopup() {
    document.getElementById('login-popup').style.display = 'none';
}

// Funzione per effettuare il login con Firebase
function loginUser() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            localStorage.setItem('loggedInUserId', user.uid); // Salva l'ID dell'utente
            checkLogin(); // Ricarica la pagina e nascondi il popup
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
            alert("Login failed! " + errorMessage); // Mostra un messaggio di errore
        });
}

// Aggiungi l'event listener per il form di login
const loginForm = document.getElementById("login-form");
loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    loginUser();
});

// Gestisci il logout
const logoutButton = document.getElementById('logout');
logoutButton.addEventListener('click', () => {
    localStorage.removeItem('loggedInUserId');
    signOut(auth).then(() => {
        showLoginPopup(); // Mostra il popup di login dopo il logout
    }).catch((error) => {
        console.error('Error signing out:', error);
    });
});

// Verifica se l'utente è loggato quando la pagina viene caricata
onAuthStateChanged(auth, (user) => {
    if (user) {
        // L'utente è loggato
        const loggedInUserId = localStorage.getItem('loggedInUserId');
        if (loggedInUserId) {
            checkLogin(); // Rendi visibile il nome utente e il resto
        }
    } else {
        // L'utente non è loggato, mostra il popup di login
        showLoginPopup();
    }
});