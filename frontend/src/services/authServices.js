// src/services/authService.js
import { API_BASE_URL } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { clearAuth } from '../api/api';

export async function loginAdmin({ email, password }) {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: email,   // backend expects 'username'
        password: password
      }),
    });

    const text = await res.text(); // IMPORTANT: backend returns text

    if (!res.ok) {
      return { ok: false, error: text || 'Login failed' };
    }

    return { ok: true, data: text }; // "Login Successful"

  } catch (err) {
    return { ok: false, error: 'Network error. Server not reachable.' };
  }
}

export async function loginStudent({ email, password, username }) {
  try {
    // backend expects email, username, password (Student object)
    const body = {
      email: email,
      username: username || email, // use username if provided, otherwise fallback to email
      password: password
    };

    const res = await fetch(`${API_BASE_URL}/students/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    // backend may return a message or empty body; keep handling robust
    const text = await res.text();

    if (!res.ok) {
      return { ok: false, error: text || 'Login failed' };
    }

    return { ok: true, data: text || 'Login Successful' };
  } catch (err) {
    return { ok: false, error: 'Network error. Server not reachable.' };
  }
}

export async function registerStudent({ email, password, username }) {
  try {
    const body = {
      email,
      username: username || email, // prefer explicit username, fallback to email
      password
    };

    const res = await fetch(`${API_BASE_URL}/students/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    // backend returns created Student object (JSON) on success; handle text fallback
    const contentType = res.headers.get('content-type') || '';
    let data;
    if (contentType.includes('application/json')) {
      data = await res.json();
    } else {
      data = await res.text();
    }

    if (!res.ok) {
      // server may return message as text or JSON; normalize error
      const errMsg = (typeof data === 'string' && data) || (data && data.message) || 'Registration failed';
      return { ok: false, error: errMsg };
    }

    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: 'Network error. Server not reachable.' };
  }
}

export async function logout() {
  try{
    const keys = ['basicAuthUser', 'studentUser', 'userRole'];
    await AsyncStorage.multiRemove(keys);
    clearAuth();
    return{ok:true};
  }catch{
    console.error('logout error: ',err);
    return{ok:false, error:'Logout failed'};
  }
}