import axios from 'axios';

const api = axios.create({
  baseURL:'http://51.20.117.87/api/auth/',
});

api.interceptors.request.use((config) => {
  // Only add token if skipAuth flag is not set
  if (!config.skipAuth) {
    const token = localStorage.getItem('access');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
