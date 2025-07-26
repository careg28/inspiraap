// Pantalla principal (Home)
// Muestra mensaje de bienvenida y botón para cerrar sesión
// Usa Firebase Auth + react-native-paper
import { signOut } from 'firebase/auth';
import { StyleSheet, View } from 'react-native';
import { Button, Text, Title } from 'react-native-paper';
import { auth } from '../../firebaseConfig';
import { saveEmotion } from '../services/saveEmotion';

export default function HomeScreen({ navigation }) {
  // Función para cerrar sesión con Firebase
  const handleLogout = async () => {
    try {
      await signOut(auth); // Cierra sesión del usuario actual
      navigation.replace('Login'); // Vuelve a pantalla de login
    } catch (error) {
      alert('Error al cerrar sesión: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Bienvenido a Inspiraap 💫</Title>

      <Text style={styles.text}>
        Aquí vas a encontrar inspiración, frases positivas y más.
      </Text>

      <Button mode="contained" onPress={handleLogout} style={styles.button}>
        Cerrar sesión
      </Button>

       <Button
        mode="contained"
        onPress={() => navigation.navigate('Profile')}
        style={{ marginTop: 20 }}
      >
        Ir a mi perfil
      </Button>
       <Button mode="outlined" onPress={() => saveEmotion('feliz')} style={{ marginTop: 20 }}>
  Registrar emoción: feliz
      </Button>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 26, marginBottom: 10, textAlign: 'center' },
  text: { fontSize: 16, marginBottom: 30, textAlign: 'center' },
  button: { marginTop: 10 },
});

