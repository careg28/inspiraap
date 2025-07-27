// Pantalla principal (Feed) donde se muestran las publicaciones de emociones de los usuarios.
// Permite ver todas las publicaciones o solo las del usuario autenticado.

import moment from 'moment'; // Para formatear fechas
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native'; // Importamos FlatList y ActivityIndicator
import { Button, Card, Paragraph, Title } from 'react-native-paper'; // Importamos Card y Paragraph para mostrar publicaciones
import { auth } from '../../firebaseConfig'; // Importación de Firebase Auth
import { getFeedPosts } from '../services/postService'; // Importación del nuevo servicio de posts

export default function HomeScreen() {
  const user = auth.currentUser;

  // Estado para almacenar las publicaciones del feed.
  const [posts, setPosts] = useState([]);
  // Estado para controlar si se están cargando las publicaciones.
  const [loading, setLoading] = useState(true);
  // Estado para rastrear errores durante la carga.
  const [error, setError] = useState(null);
  // Estado para controlar el filtro: 'all' para todas, 'my' para solo las del usuario.
  const [filter, setFilter] = useState('all'); // Por defecto, mostrar todas las publicaciones

  // Efecto para cargar las publicaciones cuando la pantalla se monta o cambia el filtro.
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true); // Inicia el estado de carga.
      setError(null); // Limpia cualquier error anterior.
      try {
        let fetchedPosts;
        if (filter === 'my' && user) {
          // Si el filtro es 'my', obtiene solo las publicaciones del usuario actual.
          fetchedPosts = await getFeedPosts(user.uid);
        } else {
          // Si el filtro es 'all' o no hay usuario, obtiene todas las publicaciones.
          fetchedPosts = await getFeedPosts(null); // null para obtener todas.
        }
        setPosts(fetchedPosts); // Actualiza el estado de las publicaciones.
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("No se pudieron cargar las publicaciones."); // Establece un mensaje de error.
      } finally {
        setLoading(false); // Finaliza el estado de carga.
      }
    };

    // Ejecuta la función de carga de publicaciones.
    fetchPosts();

    // Dependencias del efecto: user (para el filtro 'my') y filter (para recargar cuando cambia).
  }, [user, filter]);

  // Función para cerrar sesión.
  const handleSignOut = async () => {
    try {
      await auth.signOut();
      // Después de cerrar sesión, la navegación debería llevar al usuario a la pantalla de autenticación.
      // Puedes añadir lógica de navegación aquí si tu AppNavigator no lo maneja automáticamente.
    } catch (error) {
      console.error("Error signing out:", error);
      alert("Error al cerrar sesión.");
    }
  };

  // Función para renderizar cada elemento de la lista.
  const renderPostItem = ({ item }) => (
    <Card style={styles.postCard}>
      <Card.Content>
        {/* Muestra la emoción de la publicación */}
        <Title>{item.emotion}</Title>
        {/* Muestra el mensaje de la publicación si existe */}
        {item.message ? <Paragraph>{item.message}</Paragraph> : null}
        {/* Muestra el email del usuario que publicó (o UID si no hay email visible) */}
        <Text style={styles.postMeta}>
          Publicado por: {item.uid} {/* Aquí idealmente mostrarías el email o nombre de usuario */}
        </Text>
        {/* Muestra la fecha de publicación formateada */}
        <Text style={styles.postMeta}>
          Hace: {moment(item.createdAt.toDate()).fromNow()}
        </Text>
        {/* Puedes añadir más UI aquí para likes, comentarios, etc. */}
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Feed de Emociones</Title>

      {/* Contenedor para los botones de filtro */}
      <View style={styles.filterContainer}>
        <Button
          mode={filter === 'all' ? 'contained' : 'outlined'}
          onPress={() => setFilter('all')}
          style={styles.filterButton}
        >
          Todas
        </Button>
        <Button
          mode={filter === 'my' ? 'contained' : 'outlined'}
          onPress={() => setFilter('my')}
          style={styles.filterButton}
          disabled={!user} // Deshabilita si no hay usuario logueado
        >
          Mis Publicaciones
        </Button>
      </View>

      {/* Indicador de carga */}
      {loading && <ActivityIndicator size="large" style={styles.loadingIndicator} />}

      {/* Muestra errores si los hay */}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Muestra la lista de publicaciones */}
      {/* Muestra un mensaje si no hay publicaciones y no está cargando */}
      {!loading && posts.length === 0 ? (
          <Text>No hay publicaciones para mostrar.</Text>
      ) : (
        <FlatList
          data={posts} // Los datos a renderizar
          renderItem={renderPostItem} // La función que renderiza cada item
          keyExtractor={item => item.id} // Clave única para cada item
          contentContainerStyle={styles.listContent} // Estilo para el contenedor de la lista
          // Puedes añadir props para paginación aquí, como onEndReached
        />
      )}


      {/* Botón de cerrar sesión */}
      {user && ( // Solo muestra el botón si hay un usuario logueado
        <Button mode="outlined" onPress={handleSignOut} style={styles.signOutButton}>
          Cerrar Sesión ({user.email})
        </Button>
      )}
    </View>
  );
}

// Estilos básicos para la pantalla del feed.
// Considera crear un archivo styles.js separado para una mejor organización.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f0f2f5', // Color de fondo del feed
  },
  title: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 24,
    fontWeight: 'bold',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  filterButton: {
    marginHorizontal: 5,
  },
  loadingIndicator: {
      marginTop: 20,
  },
  errorText: {
      color: 'red',
      textAlign: 'center',
      marginTop: 20,
  },
  listContent: {
      paddingBottom: 20, // Espacio al final de la lista
  },
  postCard: {
    marginVertical: 8, // Espacio vertical entre tarjetas
    marginHorizontal: 5, // Espacio horizontal (opcional)
    elevation: 1, // Sombra ligera
  },
  postMeta: {
    marginTop: 5,
    fontSize: 12,
    color: '#555',
  },
  signOutButton: {
    marginTop: 20,
    marginBottom: 10,
    alignSelf: 'center',
  },
});

