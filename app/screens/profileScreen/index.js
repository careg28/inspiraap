// Pantalla de perfil de usuario. Permite visualizar info. básica y publicar estado emocional en feed.

import moment from 'moment';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Avatar, Button, Text, Title, TextInput } from 'react-native-paper';
import { auth } from '../../../firebaseConfig';
import { getLastEmotion } from '../../services/getLastEmotion'; // Obtiene última emoción del perfil (colección 'emociones').
import { saveEmotionAsPost } from '../../services/saveEmotion'; // Publica emoción y mensaje en colección 'posts'.
import { styles } from './styles';

export default function ProfileScreen() {
  const user = auth.currentUser;

  // Estado para la última emoción registrada en el perfil (colección 'emociones').
  const [lastEmotion, setLastEmotion] = useState(null);
  // Estado para el mensaje opcional a incluir en la publicación del feed.
  const [message, setMessage] = useState('');

  // Carga la última emoción del perfil al montar el componente.
  useEffect(() => {
    const fetchLastEmotion = async () => {
      const data = await getLastEmotion();
      setLastEmotion(data);
    };
    fetchLastEmotion();
  }, []); // Dependencia vacía para ejecutar solo al montar.

  // Manejador para publicar la emoción y el mensaje en el feed.
  const handleEmotion = async (emotion) => {
    try {
      // Llama al servicio para crear un nuevo documento en la colección 'posts'.
      await saveEmotionAsPost(emotion, message);

      // Nota: 'getLastEmotion' actualmente lee de la colección 'emociones'.
      // Si se quiere mostrar la última *publicación* en el feed aquí,
      // habría que modificar 'getLastEmotion' o crear una nueva función.
      const updated = await getLastEmotion();
      setLastEmotion(updated);

      // Limpia el input de mensaje después de publicar.
      setMessage('');

      alert('¡Tu emoción ha sido publicada en el feed!');

    } catch (error) {
      console.error('Error al publicar emoción:', error);
      alert('Hubo un error al publicar tu emoción: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Avatar.Text size={80} label={user?.email[0]?.toUpperCase() || 'U'} style={styles.avatar} />
      <Title style={styles.title}>Hola, {user?.email}</Title>

      {/* Muestra la última emoción del perfil (de la colección 'emociones'). */}
      {lastEmotion && (
        <Text style={styles.lastEmotion}>
          Última emoción registrada en perfil: {lastEmotion.emotion} ({moment(lastEmotion.createdAt.toDate()).fromNow()})
        </Text>
      )}

      {/* Indicación al usuario sobre la acción de publicación. */}
      <Text style={styles.subtitle}>¿Cómo te sientes hoy? (Esto se publicará en el feed)</Text>

      {/* Input para el mensaje opcional. Ubicado estratégicamente entre subtítulo y botones. */}
      <TextInput
        label="Mensaje opcional para tu publicación"
        value={message}
        onChangeText={setMessage}
        mode="outlined" // Estilo para integrar con otros componentes de Paper.
        style={styles.messageInput} // Estilos definidos en styles.js para layout/apariencia.
        multiline
        numberOfLines={4} 
      />

      {/* Grupo de botones para seleccionar la emoción. */}
      <View style={styles.buttonGroup}>
        <Button icon="emoticon-happy" mode="outlined" onPress={() => handleEmotion('feliz')} style={styles.emotionButton}>
          Feliz
        </Button>
        <Button icon="emoticon-neutral" mode="outlined" onPress={() => handleEmotion('neutral')} style={styles.emotionButton}>
          Neutral
        </Button>
        <Button icon="emoticon-sad" mode="outlined" onPress={() => handleEmotion('triste')} style={styles.emotionButton}>
          Triste
        </Button>
      </View>
    </View>
  );
}