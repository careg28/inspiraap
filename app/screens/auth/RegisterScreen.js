// Pantalla de registro de usuario
// Permite crear una cuenta usando Firebase Authentication
// Usa react-native-paper para una interfaz limpia

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, TextInput, Title } from 'react-native-paper';
import { auth } from '../../../firebaseConfig';

export default function RegisterScreen({ navigation }) {
  // Estados locales para inputs de email y contraseña
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Función para registrar al usuario
  // Si es exitoso, redirige a Home
  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigation.replace('Home'); // Redirige reemplazando el stack
    } catch (error) {
      alert(error.message); // Muestra el error si algo falla
    }
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Crear cuenta</Title>

      <TextInput
        label="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        label="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        mode="outlined"
        style={styles.input}
      />

      <Button mode="contained" onPress={handleRegister} style={styles.button}>
        Registrarse
      </Button>

      <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
        ¿Ya tienes cuenta? Inicia sesión
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 26, marginBottom: 20, textAlign: 'center' },
  input: { marginBottom: 12 },
  button: { marginTop: 10 },
  link: { marginTop: 20, textAlign: 'center', color: '#007AFF' },
});