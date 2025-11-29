import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { saveItem, getItem } from '../storage/storage';

export default function AddTaskScreen({ navigation }) {
  const [newTask, setNewTask] = useState('');

  async function handleAddTask() {
    if (newTask.trim().length === 0) {
      Alert.alert('Atenção', 'Por favor, digite uma tarefa válida!');
      return;
    }

    try {
      // Buscar tarefas existentes
      const tasks = await getItem('tasks') || [];
      
      // Adicionar nova tarefa
      const updatedTasks = [
        ...tasks, 
        { 
          text: newTask, 
          createdAt: new Date().toISOString() 
        }
      ];
      
      // Salvar no storage
      await saveItem('tasks', updatedTasks);
      
      // Voltar para tela anterior
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error);
      Alert.alert('Erro', 'Não foi possível adicionar a tarefa.');
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>← Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.title}>✏️ Adicionar nova tarefa</Text>

      <TextInput
        placeholder="Digite a tarefa..."
        placeholderTextColor="#999"
        value={newTask}
        onChangeText={setNewTask}
        style={styles.input}
        multiline
        autoFocus
      />

      <TouchableOpacity style={styles.button} onPress={handleAddTask}>
        <Text style={styles.buttonText}>💾 Salvar Tarefa</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  backButton: {
    marginTop: 40,
    marginBottom: 10,
  },
  backButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  button: { 
    backgroundColor: '#4CAF50', 
    padding: 18, 
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: { 
    color: '#fff', 
    textAlign: 'center', 
    fontWeight: 'bold',
    fontSize: 16,
  },
});