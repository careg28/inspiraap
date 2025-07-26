// Estilos para el componente ProfileScreen.

import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5', // Ejemplo de color de fondo.
  },
  avatar: {
    marginBottom: 20,
    backgroundColor: '#6200ee', // Ejemplo de color.
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  lastEmotion: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    marginTop: 10,
    marginBottom: 10,
    fontWeight: '600',
  },
  // Estilo para el TextInput del mensaje. Controla posición y tamaño.
  messageInput: {
    marginTop: 15,
    marginBottom: 15,
    width: '90%', 
    alignSelf: 'center', 
    minHeight:100,
   
  },
  // Estilo para el contenedor de los botones de emoción.
  buttonGroup: {
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    width: '100%', 
    marginTop: 20,
  },  

  emotionButton: {
    flex: 1, 
    marginHorizontal: 5, 
  },
});
