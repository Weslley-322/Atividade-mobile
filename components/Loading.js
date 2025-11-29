import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

export default function Loading({ message = "Carregando..." }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#4CAF50" />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  text: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
});