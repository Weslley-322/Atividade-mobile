import { useState, useEffect } from 'react';
import { api } from '../services/api';

export function useFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchData() {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get(url, options);
      setData(response.data);
    } catch (err) {
      setError(err.message || 'Erro ao carregar dados');
      console.error('Erro no useFetch:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (url) {
      fetchData();
    }
  }, [url]);

  // Função para refazer a requisição manualmente
  const refetch = () => {
    fetchData();
  };

  return { data, loading, error, refetch };
}

// Hook para requisições POST/PUT/DELETE
export function useRequest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function request(method, url, body = null) {
    try {
      setLoading(true);
      setError(null);

      let response;
      
      switch (method.toUpperCase()) {
        case 'POST':
          response = await api.post(url, body);
          break;
        case 'PUT':
          response = await api.put(url, body);
          break;
        case 'DELETE':
          response = await api.delete(url);
          break;
        default:
          throw new Error(`Método ${method} não suportado`);
      }

      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.message || 'Erro na requisição';
      setError(errorMessage);
      console.error('Erro no useRequest:', err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }

  return { request, loading, error };
}