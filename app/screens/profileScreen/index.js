// Pantalla donde el usuario ve su perfil y registra su estado emocional

import moment from 'moment'; // Para mostrar "hace 2 horas", etc.
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Avatar, Button, Text, Title } from 'react-native-paper';
import { auth } from '../../../firebaseConfig';
import { getLastEmotion } from '../../services/getLastEmotion';
import { saveEmotion } from '../../services/saveEmotion';
import { styles } from './styles';

export default function ProfileScreen() {
  const user = auth.currentUser;

  // Estado para guardar la última emoción
  const [lastEmotion, setLastEmotion] = useState(null);

  // Al cargar la pantalla, buscar la última emoción registrada
  useEffect(() => {
    const fetchLastEmotion = async () => {
      const data = await getLastEmotion();
      setLastEmotion(data);
    };

    fetchLastEmotion();
  }, []);

  // Cuando el usuario pulsa un botón de emoción, guardamos la emoción
  // y actualizamos la última emoción visible
  const handleEmotion = async (emotion) => {
    await saveEmotion(emotion);
    const updated = await getLastEmotion();
    setLastEmotion(updated);
  };

  return (
    <View style={styles.container}>
      <Avatar.Text size={80} label={user?.email[0]?.toUpperCase() || 'U'} style={styles.avatar} />
      <Title style={styles.title}>Hola, {user?.email}</Title>

      {/* Muestra la última emoción si existe */}
      {lastEmotion && (
        <Text style={styles.lastEmotion}>
          Última emoción: {lastEmotion.emotion} ({moment(lastEmotion.createdAt.toDate()).fromNow()})
        </Text>
      )}

      <Text style={styles.subtitle}>¿Cómo te sientes hoy?</Text>

      <View style={styles.buttonGroup}>
        <Button
          icon="emoticon-happy"
          mode="outlined"
          onPress={() => handleEmotion('feliz')}
          style={styles.emotionButton}
        >
          Feliz
        </Button>

        <Button
          icon="emoticon-neutral"
          mode="outlined"
          onPress={() => handleEmotion('neutral')}
          style={styles.emotionButton}
        >
          Neutral
        </Button>

        <Button
          icon="emoticon-sad"
          mode="outlined"
          onPress={() => handleEmotion('triste')}
          style={styles.emotionButton}
        >
          Triste
        </Button>
      </View>
    </View>
  );
}


