// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { getFirestore, getDoc, doc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

// Firebase configuration
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

// Funzione per verificare se l'utente è loggato
function checkLogin() {
    const isLoggedIn = localStorage.getItem("isLoggedIn"); // Usa localStorage per salvare lo stato di login
    if (!isLoggedIn) {
        // Se non è loggato, reindirizza alla pagina di login
        window.location.href = "authentication.html";
    } else {
        // Se è loggato, mostra il calendario
        renderCalendar();  // Rendi visibile il calendario se l'utente è loggato
    }
}

// Funzione per nascondere il popup e mostrare il calendario
function renderCalendar() {
    const monthYearLabel = document.getElementById('month-year');
    const calendarGrid = document.getElementById('calendar-grid');

    // Aggiorna il mese e anno
    const month = new Date().getMonth();
    const year = new Date().getFullYear();
    monthYearLabel.textContent = `${getMonthName(month)} ${year}`;

    // Crea la griglia del calendario
    calendarGrid.innerHTML = '';

    // Aggiungi i giorni della settimana
    const daysOfWeek = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
    daysOfWeek.forEach(day => {
        const dayLabel = document.createElement('div');
        dayLabel.textContent = day;
        calendarGrid.appendChild(dayLabel);
    });

    // Calcola il primo giorno del mese
    const firstDayOfMonth = new Date(year, month, 1);
    const firstDayIndex = firstDayOfMonth.getDay();

    // Calcola il numero di giorni nel mese
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();

    // Aggiungi i giorni del mese
    for (let i = 0; i < firstDayIndex; i++) {
        const emptyCell = document.createElement('div');
        calendarGrid.appendChild(emptyCell);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement('div');
        dayCell.textContent = day;
        calendarGrid.appendChild(dayCell);
    }

    document.getElementById("calendar").style.display = "block"; // Mostra il calendario
}

// Funzione per ottenere il nome del mese
function getMonthName(monthIndex) {
    const months = [
        "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
        "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"
    ];
    return months[monthIndex];
}

// Funzione di logout
function logoutUser() {
    localStorage.removeItem("isLoggedIn");
    signOut(auth).then(() => {
        window.location.href = "authentication.html"; // Dopo il logout, reindirizza alla pagina di login
    });
}

// Gestisci il login con Firebase
const loginForm = document.getElementById("login-form");
loginForm.addEventListener("submit", function(event) {
    event.preventDefault(); // Evita il comportamento predefinito del form
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Effettua il login con Firebase
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            localStorage.setItem("isLoggedIn", "true");  // Salva lo stato di login
            window.location.href = "index.html"; // Ricarica la pagina per nascondere il popup e mostrare il calendario
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
            alert("Login failed! " + errorMessage); // Mostra un messaggio di errore
        });
});

// Funzione per gestire il logout
const logoutButton = document.getElementById('logout-button');
logoutButton.addEventListener('click', logoutUser);

// Verifica login all'inizio
checkLogin();
