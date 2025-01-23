// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-analytics.js";
import { getAuth, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { getFirestore, getDoc, doc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

onAuthStateChanged(auth, (user) =>{
    const loggedInUserId = localStorage.getItem('loggedInUserId');
    if(loggedInUserId){
        const docRef = doc(db, "user", loggedInUserId);
        getDoc(docRef)
        .then((docSnap) =>{
            if(docSnap.exists()){
                const userData = docSnap.data();
                document.getElementById('loggedUserName').innerHTML = userData.name;
                document.getElementById('loggedUserEmail').innerHTML = userData.email;
                document.getElementById('loggedUserSurname').innerHTML = userData.surname;
            }
            else
            {
                console.log("no document found matching the id!");
            }
        })
        .catch((error) => {
            console.log("Error getting document");
        })
    }
    else{
        console.log("User Id not found in Local storage!");
    }
})

const logoutButton = document.getElementById('logout');

logoutButton.addEventListener('click', () =>{
    localStorage.removeItem('loggedInUserId');
    signOut(auth)
    .then(() =>{
        window.location.href = "authentication.html";
    })
    .catch((error) =>{
        console.error('Error Signing out:', error);
    })
})