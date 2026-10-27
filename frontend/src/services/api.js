import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export default api;

export const sessionApi = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || '/api').replace(/\/api\/?$/, ''),
  withCredentials: true,
  withXSRFToken: true,
  headers: { Accept: 'application/json' },
});

export async function prepareCsrf() {
  await sessionApi.get('/sanctum/csrf-cookie');
}
