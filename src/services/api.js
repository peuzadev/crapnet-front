import axios from 'axios';

// A URL da API será pega da variável de ambiente, que pode ser configurada no .env
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Pega a URL da variável de ambiente
});

export default api;