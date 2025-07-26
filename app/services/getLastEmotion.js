// Servicio para obtener la última emoción registrada por el usuario
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';

export async function getLastEmotion() {
  const user = auth.currentUser;
  if (!user) return null;

  try {
    const q = query(
      collection(db, 'emociones'),
      where('uid', '==', user.uid),
      orderBy('createdAt', 'desc'),
      limit(1)
    );

    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs[0].data(); // devuelve {emotion, createdAt, uid}
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error al obtener la última emoción:', error.message);
    return null;
  }
}