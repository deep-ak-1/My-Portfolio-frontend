import axios from 'axios';

const API_ORIGIN = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

export const api = axios.create({
  baseURL: `${API_ORIGIN}/api`,
  withCredentials: true,
  timeout: 15000,
});

api.interceptors.response.use((response) => {
  const type = response.headers['content-type'] || '';
  if (typeof response.data === 'string' && !type.includes('application/json')) {
    const err = new Error('The API returned a web page instead of data. Check VITE_API_URL.');
    err.code = 'NON_JSON_RESPONSE';
    throw err;
  }
  return response;
});

export const asArray = (value) => (Array.isArray(value) ? value : []);

export function getErrorMessage(err, fallback = 'Something went wrong') {
  if (err?.code === 'NON_JSON_RESPONSE') return err.message;
  const serverMessage = err?.response?.data?.message;
  if (serverMessage) return serverMessage;
  if (err?.code === 'ERR_NETWORK' || err?.code === 'ECONNABORTED') {
    return 'Cannot reach the API. Check that the backend is running.';
  }
  return fallback;
}
