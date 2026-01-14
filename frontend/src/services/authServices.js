// src/services/authService.js
import { API_BASE_URL } from '../config/api';
import { Buffer } from 'buffer';
// If you have the axios instance and setBasicAuth helper, import it (adjust path if needed):
// import api, { setBasicAuth } from '../api/api';

export async function loginAdmin({ email, password }) {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const text = await res.text();
      return { ok: false, error: text || 'Login failed' };
    }

    const data = await res.json();

    // Configure Basic Auth for future axios calls (if you use axios)
    // If you imported setBasicAuth from your axios file, call:
    // setBasicAuth(email, password);

    // If you don't have axios, but you use fetch for subsequent calls,
    // the app must add the Authorization header on each fetch call manually:
    // const token = Buffer.from(`${email}:${password}`).toString('base64');
    // save token somewhere (AsyncStorage) and attach `Authorization: Basic ${token}` to future fetch calls.

    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: 'Network error. Server not reachable.' };
  }
}
