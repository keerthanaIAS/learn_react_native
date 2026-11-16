
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://10.55.66.117:3000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export default api;
