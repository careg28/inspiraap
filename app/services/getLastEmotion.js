// Servicio para obtener la última publicación de emoción del usuario desde la colección "posts".

import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig'; // Importación de las instancias de Firebase Auth y Firestore.

/**
 * @returns {Promise<Object|null>} Un objeto con los datos de la última publicación o null si no se encuentra ninguna.
 * @throws {Error} Si no hay un usuario autenticado.
 */
export async function getLastEmotion() { // Mantenemos el nombre de la función por compatibilidad en ProfileScreen.
  const user = auth.currentUser;

  // Validación: Asegura que hay un usuario autenticado antes de realizar la consulta.
  if (!user) {
    console.error('Intento de obtener última emoción sin usuario autenticado.');
    throw new Error('No hay usuario autenticado');
  }

  try {
    // Crea una consulta a la colección 'posts'.
    const q = query(
      collection(db, 'posts'), // *** CAMBIO CLAVE: Apunta a la colección 'posts' ***
      where('uid', '==', user.uid), // Filtra por el ID del usuario autenticado.
      orderBy('createdAt', 'desc'), // Ordena los resultados por fecha de creación descendente (más reciente primero).
      limit(1) // Limita el resultado a un solo documento (el más reciente).
    );

    // Ejecuta la consulta en Firestore.
    const querySnapshot = await getDocs(q);

    // Verifica si se encontraron documentos.
    if (querySnapshot.empty) {
      console.log(`No se encontraron publicaciones de emoción para el usuario ${user.uid}.`);
      return null; // No hay publicaciones, devuelve null.
    }

    // Si se encontró un documento, extrae sus datos.
    const lastPostDoc = querySnapshot.docs[0];
    // Devuelve un objeto combinando el ID del documento con sus datos.
    return { id: lastPostDoc.id, ...lastPostDoc.data() };

  } catch (error) {
    // Captura y registra cualquier error durante la consulta a Firestore.
    console.error('Error al obtener la última publicación de emoción:', error.message);
    // Propaga el error para que pueda ser manejado por el código que llama a esta función.
    throw error;
  }
}