import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5001/api',
  withCredentials: true,
});

// Unified api object — use this everywhere in the app
export const api = {
  get: (endpoint) => instance.get(endpoint).then(r => r.data),
  post: (endpoint, data) => instance.post(endpoint, data).then(r => r.data),
  put: (endpoint, data) => instance.put(endpoint, data).then(r => r.data),
  delete: (endpoint) => instance.delete(endpoint).then(r => r.data),
  // Expose raw axios instance for special cases (e.g. FormData uploads)
  instance,
};

