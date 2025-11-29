import axios from "axios";

export const api = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para log de requisições (desenvolvimento)
api.interceptors.request.use(
  config => {
    console.log(`📤 ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erros
api.interceptors.response.use(
  response => {
    console.log(`✅ ${response.config.method.toUpperCase()} ${response.config.url} - ${response.status}`);
    return response;
  },
  error => {
    console.error('❌ Erro na API:', error.message);
    return Promise.reject(error);
  }
);