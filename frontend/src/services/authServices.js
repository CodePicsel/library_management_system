// src/services/authService.js
import { API_BASE_URL } from '../config/api';

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
