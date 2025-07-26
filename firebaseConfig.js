// Configuración base de Firebase + export de auth y firestore

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // 👉 importamos Firestore


const firebaseConfig = {
  apiKey: "AIzaSyAjBFaYGzEJEVS6MDX-a-ODsVo4edWafNA",
  authDomain: "inspiraap-01.firebaseapp.com",
  projectId: "inspiraap-01",
  storageBucket: "inspiraap-01.appspot.com",
  messagingSenderId: "614181712414",
  appId: "1:614181712414:web:05345bfbcf44a44659340f",
};

// Inicializa la app Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Auth y Firestore
const auth = getAuth(app);
const db = getFirestore(app); // 👉 inicializamos Firestore

// Exportamos para usar en toda la app
export { auth, db };

