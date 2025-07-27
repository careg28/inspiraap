// Pantalla de registro de usuario. Ahora incluye campo para apodo único.

import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native'; // Importamos Alert para mostrar mensajes al usuario
import { Button, Text, TextInput, Title } from 'react-native-paper';
// Asumiendo que tienes un servicio de autenticación, lo importaríamos aquí.
// Por ahora, modificaremos handleRegister directamente si la lógica de registro está aquí.
// import { registerUser } from '../../services/authService'; // Ejemplo si tuvieras un servicio de auth

// Importaciones de Firebase Authentication y Firestore para guardar el apodo
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore'; // Importamos funciones de Firestore
import { auth, db } from '../../../firebaseConfig'; // Asegúrate de que db también se importa aquí

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Nuevo estado para el apodo
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false); // Estado para controlar el estado de carga

  // Función para verificar si el apodo ya existe en Firestore
  const isNicknameUnique = async (nickname) => {
    // Consulta la colección 'users' para ver si ya existe un documento con este apodo
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('nickname', '==', nickname));
    const querySnapshot = await getDocs(q);
    // Si querySnapshot no está vacío, significa que ya existe un usuario con ese apodo
    return querySnapshot.empty; // Devuelve true si es único, false si ya existe
  };

  const handleRegister = async () => {
    // Validación básica de campos
    if (email.trim() === '' || password.trim() === '' || nickname.trim() === '') {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setLoading(true); // Inicia el estado de carga

    try {
      // 1. Verificar unicidad del apodo
      const unique = await isNicknameUnique(nickname.trim());
      if (!unique) {
        Alert.alert('Error', 'Este apodo ya está en uso. Por favor, elige otro.');
        setLoading(false);
        return;
      }

      // 2. Crear usuario con Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password.trim());
      const user = userCredential.user; // Obtiene el objeto de usuario de Firebase Auth

      // 3. Guardar información adicional (apodo) en Firestore en una colección 'users'
      // Usamos el UID de Firebase Auth como ID del documento en la colección 'users'
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid, // Guardamos el UID también por si acaso
        email: user.email, // Opcional: guardar email también aquí
        nickname: nickname.trim(), // Guardamos el apodo
        createdAt: new Date(), // Opcional: fecha de creación del perfil
      });

      // Registro exitoso
      Alert.alert('Éxito', '¡Cuenta creada exitosamente! Ahora inicia sesión.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') } // Navega a la pantalla de Login
      ]);

    } catch (error) {
      console.error('Error en el registro:', error);
      let errorMessage = 'Ocurrió un error durante el registro.';
      // Puedes añadir manejo de errores específicos de Firebase Auth aquí
      // if (error.code === 'auth/email-already-in-use') { ... }
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false); // Finaliza el estado de carga
    }
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Crear cuenta</Title>

      {/* TextInput para el correo electrónico */}
      <TextInput
        label="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      {/* TextInput para el apodo */}
      <TextInput
        label="Apodo (nombre público)"
        value={nickname}
        onChangeText={setNickname}
        mode="outlined"
        style={styles.input} // Puedes usar el mismo estilo que otros inputs o uno específico
        autoCapitalize="none" // Generalmente los apodos no necesitan capitalización automática
      />

      {/* TextInput para la contraseña */}
      <TextInput
        label="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        mode="outlined"
        style={styles.input}
      />

      {/* Botón de registro - Deshabilitado mientras carga */}
      <Button mode="contained" onPress={handleRegister} style={styles.button} loading={loading} disabled={loading}>
        Registrarse
      </Button>

      {/* Enlace a la pantalla de Login */}
      <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
        ¿Ya tienes cuenta? Inicia sesión
      </Text>
    </View>
  );
}

// Estilos (basados en tu fragmento, puedes tener más estilos en styles.js)
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