import axios from 'axios';

// All requests go to /api. In production, Netlify forwards them to the Render API.
export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  timeout: 12000,
});

// If /api is not routed to the backend, the server returns the website's HTML page with status 200.
// Turn that into a clear error instead of passing HTML into the UI as data.
api.interceptors.response.use((response) => {
  const type = response.headers['content-type'] || '';
  if (typeof response.data === 'string' && !type.includes('application/json')) {
    const err = new Error('The /api route returned a web page, not data. Check the Netlify redirect rules.');
    err.code = 'NON_JSON_RESPONSE';
    throw err;
  }
  return response;
});

// Guarantees a list, even if the server returns something unexpected.
export const asArray = (value) => (Array.isArray(value) ? value : []);

export function getErrorMessage(err, fallback = 'Something went wrong') {
  if (err?.code === 'NON_JSON_RESPONSE') return err.message;
  const serverMessage = err?.response?.data?.message;
  if (serverMessage) return serverMessage;
  if (err?.code === 'ERR_NETWORK' || err?.code === 'ECONNABORTED') {
    return 'Cannot reach the API. Check that the backend is running.';
  }
  if (err?.response?.status === 404) {
    return 'The API route was not found. Check the Netlify redirect rules.';
  }
  return fallback;
}
