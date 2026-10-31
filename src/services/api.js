import axios from 'axios';

// All requests go to /api on the Vite dev server, which proxies them to Express.
export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  timeout: 12000,
});

// Turns an axios error into a message a non-developer can act on.
export function getErrorMessage(err, fallback = 'Something went wrong') {
  const serverMessage = err?.response?.data?.message;
  if (serverMessage) return serverMessage;
  if (err?.code === 'ERR_NETWORK' || err?.code === 'ECONNABORTED') {
    return 'Cannot reach the API. Start it with npm run dev (or npm run dev:server) and check port 5000.';
  }
  if (err?.response?.status === 500) {
    return 'The API returned an error with no details. The Vite proxy usually cannot reach Express. Check the API terminal.';
  }
  return fallback;
}
