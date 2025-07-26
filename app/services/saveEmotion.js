// Servicio para guardar cómo se siente el usuario como una publicación en el feed
// Guarda los datos en Firestore bajo la colección "posts"

import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig'; // importamos auth y db de Firebase

// Esta función guarda la emoción como una publicación en la base de datos
// Recibe un string con la emoción ("feliz", "triste", etc.)
// también puede recibir un mensaje opcional
export async function saveEmotionAsPost(emotion, message = '') { 
  const user = auth.currentUser; // conseguimos el usuario loguado actual

  // Validación: si no hay usuario logueado, lanzamos error
  if (!user) {
    throw new Error('No hay usuario autenticado');
  }

  try {
    // Creamos un nuevo documento en la colección "posts" con la nueva estructura
    await addDoc(collection(db, 'posts'), {
      uid: user.uid,
      emotion: emotion,
      message: message, 
      createdAt: Timestamp.now(),
      likesCount: 0, 
      commentsCount: 0, 
    });

    console.log(`✅ Estado de ánimo "${emotion}" guardado correctamente`);
  } catch (error) {
    console.error('❌ Error al guardar tu estado de ánimo:', error.message);
  }
}


/*
export async function saveEmotion(emotion) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error('No hay usuario autenticado');
  }

  try {
    await addDoc(collection(db, 'emociones'), {
      uid: user.uid,
      emotion: emotion,
      createdAt: Timestamp.now(),
    });

    console.log(`✅ Emoción "${emotion}" guardada correctamente en la colección "emociones"`);
  } catch (error) {
    console.error('❌ Error al guardar emoción en la colección "emociones":', error.message);
  }
}
*/
