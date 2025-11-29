import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet,
  ScrollView,
  Alert 
} from 'react-native';
import { saveItem, getItem } from '../storage/storage';
import { useRequest } from '../hooks/useFetch';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

export default function EditarPostScreen({ route, navigation }) {
  // Receber tarefa via params
  const { task, index } = route.params;
  
  const [taskText, setTaskText] = useState('');
  const [originalTask, setOriginalTask] = useState(null);
  const { request, loading, error } = useRequest();

  useEffect(() => {
    // Preencher campos com dados existentes
    const text = task.text || task;
    setTaskText(text);
    setOriginalTask(task);
  }, []);

  async function handleUpdate() {
    if (taskText.trim().length === 0) {
      Alert.alert('Atenção', 'Por favor, digite um texto válido para a tarefa!');
      return;
    }

    const updatedTask = {
      text: taskText,
      createdAt: originalTask.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Fazer requisição PUT para API
    const result = await request('PUT', `/posts/${index + 1}`, updatedTask);

    if (result.success) {
      // Salvar no AsyncStorage somente se PUT foi bem-sucedido
      await updateTaskInStorage(updatedTask);
      
      Alert.alert(
        'Sucesso! ✅',
        'Tarefa atualizada com sucesso!',
        [
          { 
            text: 'OK', 
            onPress: () => navigation.goBack() 
          }
        ]
      );
    }
  }

  async function updateTaskInStorage(updatedTask) {
    try {
      // Buscar todas as tarefas
      const tasks = await getItem('tasks') || [];
      
      // Atualizar a tarefa específica
      tasks[index] = updatedTask;
      
      // Salvar de volta
      await saveItem('tasks', tasks);

      // Atualizar favoritos também, se existir
      const favorites = await getItem('favorites') || [];
      const favoriteIndex = favorites.findIndex(fav => fav.index === index);
      
      if (favoriteIndex !== -1) {
        favorites[favoriteIndex] = { ...updatedTask, index };
        await saveItem('favorites', favorites);
      }
    } catch (err) {
      console.error('Erro ao atualizar no storage:', err);
    }
  }

  if (loading) {
    return <Loading message="Atualizando tarefa..." />;
  }

  if (error) {
    return (
      <ErrorMessage 
        message={error}
        onRetry={handleUpdate}
      />
    );
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>← Voltar</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.headerSection}>
          <Text style={styles.icon}>✏️</Text>
          <Text style={styles.title}>Editar Tarefa</Text>
        </View>
        
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>📋 Tarefa #{index + 1}</Text>
          <Text style={styles.infoText}>
            Criada em: {originalTask?.createdAt 
              ? new Date(originalTask.createdAt).toLocaleDateString('pt-BR')
              : 'Data não disponível'
            }
          </Text>
        </View>

        <Text style={styles.label}>Descrição da Tarefa:</Text>
        <TextInput
          placeholder="Digite a descrição da tarefa..."
          placeholderTextColor="#999"
          value={taskText}
          onChangeText={setTaskText}
          style={styles.input}
          multiline
          autoFocus
        />

        <TouchableOpacity 
          style={styles.updateButton} 
          onPress={handleUpdate}
          disabled={loading}
        >
          <Text style={styles.updateButtonText}>
            {loading ? '⏳ Atualizando...' : '💾 Salvar Alterações'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  backButton: {
    margin: 20,
    marginTop: 60,
  },
  backButtonText: {
    color: '#FF9800',
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
    paddingTop: 0,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  icon: {
    fontSize: 48,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  infoCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 13,
    color: '#999',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#555',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  updateButton: {
    backgroundColor: '#FF9800',
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  updateButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 17,
  },
  cancelButton: {
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  cancelButtonText: {
    color: '#666',
    textAlign: 'center',
    fontSize: 16,
  },
});