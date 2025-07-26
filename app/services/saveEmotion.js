// Servicio para guardar cómo se siente el usuario
// Guarda los datos en Firestore bajo la colección "emociones"

import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig'; // importamos auth y db de Firebase

// Esta función guarda la emoción en la base de datos
// Recibe un string con la emoción ("feliz", "triste", etc.)
export async function saveEmotion(emotion) {
  const user = auth.currentUser; // usuario logueado actualmente

  // Validación: si no hay usuario logueado, lanzamos error
  if (!user) {
    throw new Error('No hay usuario autenticado');
  }

  try {
    // Creamos un nuevo documento en la colección "emociones"
    await addDoc(collection(db, 'emociones'), {
      uid: user.uid,
      emotion: emotion,
      createdAt: Timestamp.now(),
    });

    console.log(`✅ Emoción "${emotion}" guardada correctamente`);
  } catch (error) {
    console.error('❌ Error al guardar emoción:', error.message);
  }
}