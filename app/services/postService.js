// Servicios para interactuar con las publicaciones (posts) en Firestore.

import { collection, getDocs, limit, orderBy, query, startAfter, where } from 'firebase/firestore';
import { db } from '../../firebaseConfig'; // Importación de las instancias de Firebase.

/**
 * Obtiene una lista de publicaciones del feed desde Firestore.
 * Permite filtrar por usuario y paginación.
 * @param {string|null} userId - El ID del usuario para filtrar publicaciones, o null para obtener todas.
 * @param {object|null} lastPost - El último documento obtenido en la paginación anterior, para obtener más resultados.
 * @param {number} limitCount - El número máximo de publicaciones a obtener en esta consulta.
 * @returns {Promise<Array<Object>>} Un array de objetos, donde cada objeto es una publicación con su ID.
 * @throws {Error} Si ocurre un error durante la consulta a Firestore.
 */
export async function getFeedPosts(userId = null, lastPost = null, limitCount = 20) {
  try {
    let postsQuery;
    // Referencia a la colección 'posts'.
    const postsRef = collection(db, 'posts');

    // Construye la consulta dinámicamente.
    if (userId) {
      // Si se especifica un userId, filtra por ese usuario.
      postsQuery = query(
        postsRef,
        where('uid', '==', userId),
        orderBy('createdAt', 'desc'), // Ordena por fecha de creación descendente.
        limit(limitCount) // Limita el número de resultados.
      );
    } else {
      // Si no se especifica userId, obtiene todas las publicaciones.
      postsQuery = query(
        postsRef,
        orderBy('createdAt', 'desc'), // Ordena por fecha de creación descendente.
        limit(limitCount) // Limita el número de resultados.
      );
    }

    // Implementación básica de paginacion:
    // Si se proporciona 'lastPost', la consulta empieza despues de ese documento.
    if (lastPost) {
        postsQuery = query(postsQuery, startAfter(lastPost));
    }

    // Ejecuta la consulta.
    const querySnapshot = await getDocs(postsQuery);

    // Mapea los documentos obtenidos a un array de objetos.
    const posts = querySnapshot.docs.map(doc => ({
      id: doc.id, // Incluye el ID del documento.
      ...doc.data(), // Incluye todos los datos del documento.
    }));


    console.log(`✅ Obtenidas ${posts.length} publicaciones.`);
    return posts;

  } catch (error) {
    console.error('❌ Error al obtener publicaciones del feed:', error.message);
    // Propaga el error para que sea manejado en el componente que llama.
    throw error;
  }
}