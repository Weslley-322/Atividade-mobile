import AsyncStorage from "@react-native-async-storage/async-storage";

// Salvar item no storage
export async function saveItem(key, value) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Erro ao salvar:', error);
    return false;
  }
}

// Buscar item do storage
export async function getItem(key) {
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Erro ao buscar:', error);
    return null;
  }
}

// Remover item do storage
export async function removeItem(key) {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Erro ao remover:', error);
    return false;
  }
}

// Limpar todo o storage
export async function clearStorage() {
  try {
    await AsyncStorage.clear();
    return true;
  } catch (error) {
    console.error('Erro ao limpar:', error);
    return false;
  }
}