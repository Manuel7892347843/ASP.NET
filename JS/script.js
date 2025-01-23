// Selezioniamo i pulsanti per alternare i form
const toggleToRegister = document.getElementById('toggleToRegister');
const toggleToLogin = document.getElementById('toggleToLogin');

// Selezioniamo i form e il contenitore
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const formContainer = document.querySelector('.form-container'); // Contenitore principale

// Aggiungiamo il listener per il pulsante "Vai alla registrazione"
toggleToRegister.addEventListener('click', () => {
    // Cambia colore di sfondo per il form container
    formContainer.style.backgroundColor = 'rgb(53, 47, 79)'; // Colore per registrazione
    //formContainer.style.boxShadow = '0px 0px 20px rgb(255, 255, 255)';

    // Aggiungiamo l'effetto opacità al login
    loginForm.style.opacity = 0;
    setTimeout(() => {
        loginForm.classList.add('hidden');  // Nascondiamo il form di login
        registerForm.classList.remove('hidden');  // Mostriamo il form di registrazione
        registerForm.style.opacity = 1;  // Ripristiniamo l'opacità del form di registrazione
    }, 500); // Tempo di transizione per opacità
});

// Aggiungiamo il listener per il pulsante "Vai al login"
toggleToLogin.addEventListener('click', () => {
    // Cambia colore di sfondo per il form container
    formContainer.style.backgroundColor = 'darkslategray'; // Colore per login

    // Aggiungiamo l'effetto opacità alla registrazione
    registerForm.style.opacity = 0;
    setTimeout(() => {
        registerForm.classList.add('hidden');  // Nascondiamo il form di registrazione
        loginForm.classList.remove('hidden');  // Mostriamo il form di login
        loginForm.style.opacity = 1;  // Ripristiniamo l'opacità del form di login
    }, 500); // Tempo di transizione per opacità
});

// Impostiamo l'opacità iniziale del form di registrazione
registerForm.style.opacity = 0;