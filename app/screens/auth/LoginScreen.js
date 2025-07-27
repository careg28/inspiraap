
// Pantalla de inicio de sesión.

import { signInWithEmailAndPassword } from 'firebase/auth'; // Importación de la función de inicio de sesión
import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native'; // Importamos Alert
import { Button, Text, TextInput, Title } from 'react-native-paper';
import { auth } from '../../../firebaseConfig'; // Importación de la instancia de autenticación

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    // Validación básica
    if (email.trim() === '' || password.trim() === '') {
        Alert.alert('Error', 'Por favor, introduce correo y contraseña.');
        return;
    }

    try {
      // Intenta iniciar sesión con Firebase Authentication
      await signInWithEmailAndPassword(auth, email.trim(), password.trim());

      // Inicio de sesión exitoso: navegar a la pantalla principal (Home)
      // Usamos replace para que el usuario no pueda volver a Login/Register
      navigation.replace('Home'); // *** AÑADIR ESTA LÍNEA ***

    } catch (error) {
      // Manejo de errores de inicio de sesión
      console.error('Error logging in:', error);
      let errorMessage = 'Error al iniciar sesión. Verifica tu correo y contraseña.';
      // Puedes añadir manejo de errores específicos aquí, como auth/user-not-found, auth/wrong-password
      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Inspiraap ✨</Title>
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
      <Button mode="contained" onPress={handleLogin} style={styles.button}>
        Entrar
      </Button>
      <Text style={styles.link} onPress={() => navigation.navigate('Register')}>
        ¿No tienes cuenta? Regístrate
      </Text>
    </View>
  );
}

// Estilos (basados en tu fragmento)
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5', // Ejemplo
      },
      title: {
        fontSize: 28,
        marginBottom: 20,
        fontWeight: 'bold',
      },
      input: {
        width: '100%', // O el ancho que prefieras
        marginBottom: 15,
      },
      button: {
        width: '100%', // O el ancho que prefieras
        paddingVertical: 8,
        marginTop: 10,
      },
      link: {
        marginTop: 20,
        color: '#6200ee', // Ejemplo de color de enlace
      },
});
