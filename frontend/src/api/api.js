// src/api/api.js
import axios from 'axios';
import { Buffer } from 'buffer';
import { API_BASE_URL } from '../config/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // ms
  headers: { 'Content-Type': 'application/json' },
});

export function setBasicAuth(username, password) {
  if (username && password) {
    const token = Buffer.from(`${username}:${password}`).toString('base64');
    api.defaults.headers.common.Authorization = `Basic ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

export function clearAuth() {
  delete api.defaults.headers.common.Authorization;
}

export default api;
