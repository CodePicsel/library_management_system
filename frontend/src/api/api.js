// /api/api.js
import axios from 'axios';
import { Buffer } from 'buffer';

const api = axios.create({
  baseURL: 'http://10.0.2.2:8081',
  timeout: 60,
  headers: { 'Content-Type': 'application/json' },
});

export function setBasicAuth(username, password) {
  if(username && password){
    const token = Buffer.from(`${username}:${password}`).toString('base64');
    api.defaults.headers.common.Authorization = `Basic ${token}`;
  }else{
    delete api.defaults.headers.common.Authorization;
  }
}

export function clearAuth() {
  delete api.defaults.headers.common.Authorization;
}

export default api;
