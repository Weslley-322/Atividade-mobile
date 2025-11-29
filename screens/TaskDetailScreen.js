import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function TaskDetailScreen({ route, navigation }) {
  const { task, index } = route.params;
  
  // Suporte para formato antigo (string) e novo (objeto)
  const taskText = task.text || task;
  const createdAt = task.createdAt 
    ? new Date(task.createdAt).toLocaleString('pt-BR') 
    : 'Data não disponível';

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>← Voltar</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.label}>📋 Tarefa #{index + 1}</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descrição:</Text>
          <Text style={styles.taskText}>{taskText}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🕒 Criada em:</Text>
          <Text style={styles.dateText}>{createdAt}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Estatísticas:</Text>
          <Text style={styles.infoText}>
            • Caracteres: {taskText.length}
          </Text>
          <Text style={styles.infoText}>
            • Palavras: {taskText.split(' ').filter(w => w).length}
          </Text>
        </View>
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
    color: '#2196F3',
    fontSize: 16,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  label: {
    fontSize: 14,
    color: '#999',
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'bold',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  taskText: {
    fontSize: 20,
    color: '#333',
    lineHeight: 28,
  },
  dateText: {
    fontSize: 16,
    color: '#555',
  },
  infoText: {
    fontSize: 15,
    color: '#666',
    marginBottom: 6,
  },
});