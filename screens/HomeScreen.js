import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { saveItem, getItem } from '../storage/storage';

export default function HomeScreen({ navigation }) {
  const [tasks, setTasks] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // Carregar tarefas do storage
  useEffect(() => {
    loadTasks();
    loadFavorites();
  }, []);

  // Recarregar ao focar na tela
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadTasks();
      loadFavorites();
    });
    return unsubscribe;
  }, [navigation]);

  // Salvar tarefas quando mudarem
  useEffect(() => {
    if (tasks.length > 0) {
      saveTasks();
    }
  }, [tasks]);

  async function loadTasks() {
    try {
      const savedTasks = await getItem('tasks');
      if (savedTasks !== null) {
        setTasks(savedTasks);
      }
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
    }
  }

  async function saveTasks() {
    try {
      await saveItem('tasks', tasks);
    } catch (error) {
      console.error('Erro ao salvar tarefas:', error);
    }
  }

  async function loadFavorites() {
    const data = await getItem('favorites');
    if (data) setFavorites(data);
  }

  function removeTask(index) {
    Alert.alert(
      'Remover Tarefa',
      'Deseja realmente remover esta tarefa?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => {
            const newTasks = tasks.filter((_, i) => i !== index);
            setTasks(newTasks);
          }
        }
      ]
    );
  }

  // Verificar se uma tarefa é favorita
  function isFavorite(taskIndex) {
    return favorites.some(fav => fav.index === taskIndex);
  }

  // Toggle favorito
  async function toggleFavorite(task, index) {
    let updated;
    
    if (isFavorite(index)) {
      updated = favorites.filter(fav => fav.index !== index);
    } else {
      updated = [...favorites, { ...task, index }];
    }
    
    setFavorites(updated);
    await saveItem('favorites', updated);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📝 Minhas Tarefas</Text>

      {/* Botão para ver favoritos */}
      <TouchableOpacity 
        style={styles.favoritesButton}
        onPress={() => navigation.navigate('Favorites')}
      >
        <Text style={styles.favoritesButtonText}>
          ⭐ Ver Favoritos ({favorites.length})
        </Text>
      </TouchableOpacity>

      {tasks.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhuma tarefa ainda 😅</Text>
          <Text style={styles.emptySubtext}>Toque no botão + para adicionar</Text>
        </View>
      )}

      <FlatList
        data={tasks}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.taskCard}>
            <TouchableOpacity
              style={styles.taskContent}
              onPress={() => navigation.navigate('TaskDetail', { task: item, index })}
              onLongPress={() => removeTask(index)}
            >
              <Text style={styles.taskText}>{item.text || item}</Text>
              
              {/* CORRIGIDO: Ações agora estão visíveis */}
              <View style={styles.taskActions}>
                <Text style={styles.taskHint}>Toque longo: remover</Text>
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation(); // Evita abrir detalhes
                    navigation.navigate('EditarPost', { task: item, index });
                  }}
                >
                  <Text style={styles.editText}>✏️ Editar</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>

            {/* Botão de favorito */}
            <TouchableOpacity 
              style={[
                styles.favoriteButton,
                isFavorite(index) && styles.favoriteButtonActive
              ]}
              onPress={() => toggleFavorite(item, index)}
            >
              <Text style={styles.favoriteIcon}>
                {isFavorite(index) ? '⭐' : '☆'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddTask')}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f5f5f5',
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginTop: 60,
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  favoritesButton: {
    backgroundColor: '#FFC107',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  favoritesButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#bbb',
  },
  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  taskContent: {
    flex: 1,
    padding: 16,
  },
  taskText: { 
    fontSize: 18, 
    color: '#333',
    marginBottom: 8,
  },
  taskActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  taskHint: {
    fontSize: 11,
    color: '#999',
    fontStyle: 'italic',
  },
  editText: {
    fontSize: 13,
    color: '#FF9800',
    fontWeight: 'bold',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  favoriteButton: {
    width: 60,
    height: '100%',
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
  addButton: {
    backgroundColor: '#4CAF50',
    width: 60,
    height: 60,
    borderRadius: 30,
    position: 'absolute',
    bottom: 30,
    right: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  addButtonText: { 
    color: '#fff', 
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: -3,
  },
});