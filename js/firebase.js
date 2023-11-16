import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.1.2/firebase-app.js';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut, signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword, setPersistence, browserLocalPersistence } from 'https://www.gstatic.com/firebasejs/9.1.2/firebase-auth.js';

const firebaseConfig = {
    apiKey: "AIzaSyBbOnAzgLj4PRB5-MjF8cXB2cqrb9S7Iic",
    authDomain: "login-d7696.firebaseapp.com",
    projectId: "login-d7696",
    storageBucket: "login-d7696.appspot.com",
    messagingSenderId: "821589441818",
    appId: "1:821589441818:web:fac7d439332047665b00a3",
    measurementId: "G-13QEGWHE82"
};

// Inicialización de Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Función para iniciar sesión con Google
export function signInWithEmailAndPassword(email, password) {
    firebaseSignInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("Usuario autenticado:", user.email);
        })
        .catch((error) => {
            console.error("Error al autenticar:", error.message);
        });
}

setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log('Persistencia de autenticación establecida en LOCAL');
  })
  .catch(error => {
    console.error('Error estableciendo persistencia:', error);
  });
  
// Función para cerrar sesión
export function signOut() {
    firebaseSignOut(auth)
        .then(() => {
            console.log("Usuario cerró sesión exitosamente");
        })
        .catch((error) => {
            console.error("Error al cerrar sesión:", error);
        });
}
