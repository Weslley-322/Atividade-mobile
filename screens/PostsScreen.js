import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  FlatList, 
  ActivityIndicator, 
  TouchableOpacity, 
  StyleSheet,
  RefreshControl 
} from "react-native";
import { api } from "../services/api";
import { saveItem, getItem } from "../storage/storage";

export default function PostsScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Carregar posts da API
  async function loadPosts() {
    try {
      const response = await api.get("/posts");
      setPosts(response.data);
    } catch (error) {
      alert("Erro ao carregar posts da API.");
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  // Carregar favoritos do storage
  async function loadFavorites() {
    const data = await getItem("favorites");
    if (data) setFavorites(data);
  }

  // Verificar se um post é favorito
  function isFavorite(postId) {
    return favorites.some(fav => fav.id === postId);
  }

  // Toggle favorito
  async function toggleFavorite(post) {
    let updated;
    
    if (isFavorite(post.id)) {
      // Remover dos favoritos
      updated = favorites.filter(fav => fav.id !== post.id);
    } else {
      // Adicionar aos favoritos
      updated = [...favorites, post];
    }
    
    setFavorites(updated);
    await saveItem("favorites", updated);
  }

  // Refresh
  function onRefresh() {
    setRefreshing(true);
    loadPosts();
  }

  useEffect(() => {
    loadPosts();
    loadFavorites();
  }, []);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Carregando posts...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📚 Posts da API</Text>
        <TouchableOpacity 
          style={styles.favButton}
          onPress={() => navigation.navigate('Favorites', { favorites })}
        >
          <Text style={styles.favButtonText}>
            ⭐ Favoritos ({favorites.length})
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={posts.slice(0, 20)} // Primeiros 20 posts
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.postCard}>
            <View style={styles.postContent}>
              <Text style={styles.postTitle}>{item.title}</Text>
              <Text style={styles.postBody} numberOfLines={2}>
                {item.body}
              </Text>
            </View>
            
            <TouchableOpacity 
              style={[
                styles.favoriteButton,
                isFavorite(item.id) && styles.favoriteButtonActive
              ]}
              onPress={() => toggleFavorite(item)}
            >
              <Text style={styles.favoriteIcon}>
                {isFavorite(item.id) ? '⭐' : '☆'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  favButton: {
    backgroundColor: '#FFC107',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  favButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  listContent: {
    padding: 15,
  },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postContent: {
    flex: 1,
    marginRight: 10,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
    textTransform: 'capitalize',
  },
  postBody: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  favoriteButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButtonActive: {
    backgroundColor: '#FFF3CD',
  },
  favoriteIcon: {
    fontSize: 24,
  },
});