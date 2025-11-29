import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet,
  Alert 
} from "react-native";
import { saveItem, getItem } from "../storage/storage";

export default function FavoritesScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);

  // Carregar favoritos do storage
  async function loadFavorites() {
    const data = await getItem("favorites");
    if (data) {
      setFavorites(data);
    }
  }

  // Remover favorito
  async function removeFavorite(taskIndex) {
    Alert.alert(
      'Remover Favorito',
      'Deseja remover esta tarefa dos favoritos?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            const updated = favorites.filter(fav => fav.index !== taskIndex);
            setFavorites(updated);
            await saveItem("favorites", updated);
          }
        }
      ]
    );
  }

  // Limpar todos os favoritos
  async function clearAllFavorites() {
    Alert.alert(
      'Limpar Favoritos',
      'Deseja remover TODAS as tarefas favoritas?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar Tudo',
          style: 'destructive',
          onPress: async () => {
            setFavorites([]);
            await saveItem("favorites", []);
          }
        }
      ]
    );
  }

  // Recarregar ao focar na tela
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadFavorites();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    loadFavorites();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* Botão do topo APENAS se tiver favoritos */}
        {favorites.length > 0 && (
          <TouchableOpacity 
            style={styles.backButtonHeader}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonHeaderText}>← Voltar</Text>
          </TouchableOpacity>
        )}
        
        <Text style={styles.title}>⭐ Minhas Tarefas Favoritas</Text>
        
        {favorites.length > 0 && (
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={clearAllFavorites}
          >
            <Text style={styles.clearButtonText}>🗑️ Limpar Tudo</Text>
          </TouchableOpacity>
        )}
      </View>

      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>⭐</Text>
          <Text style={styles.emptyText}>Nenhuma tarefa favorita</Text>
          <Text style={styles.emptySubtext}>
            Favorite tarefas na tela principal para vê-las aqui!
          </Text>
          {/* Botão central quando vazio */}
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Voltar para Tarefas</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.favoriteCard}>
              <View style={styles.favoriteContent}>
                <Text style={styles.favoriteTitle}>
                  {item.text || item}
                </Text>
                {item.createdAt && (
                  <Text style={styles.favoriteDate}>
                    Criada em: {new Date(item.createdAt).toLocaleDateString('pt-BR')}
                  </Text>
                )}
              </View>
              
              <TouchableOpacity 
                style={styles.removeButton}
                onPress={() => removeFavorite(item.index)}
              >
                <Text style={styles.removeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#FFC107',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#FFB300',
  },
  backButtonHeader: {
    marginBottom: 10,
  },
  backButtonHeaderText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  clearButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#FFC107',
    fontWeight: 'bold',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 30,
  },
  backButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  listContent: {
    padding: 15,
  },
  favoriteCard: {
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
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
  },
  favoriteContent: {
    flex: 1,
    marginRight: 10,
  },
  favoriteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  favoriteDate: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  removeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffebee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    fontSize: 20,
    color: '#f44336',
    fontWeight: 'bold',
  },
});