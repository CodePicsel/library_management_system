// /context/AuthContext.js
import React, { createContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api, { setAuthToken } from '../api/api';

export const AuthContext = createContext();

const initialState = {
  isLoading: true,
  userToken: null
};

function reducer(state, action) {
  switch (action.type) {
    case 'RESTORE_TOKEN':
      return { ...state, userToken: action.token, isLoading: false };
    case 'SIGN_IN':
      return { ...state, userToken: action.token, isLoading: false };
    case 'SIGN_OUT':
      return { ...state, userToken: null, isLoading: false };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    // restore token on startup
    const bootstrap = async () => {
      let token = null;
      try {
        token = await AsyncStorage.getItem('userToken');
        if (token) setAuthToken(token);
      } catch (e) {
        console.warn('Failed to restore token:', e);
      } finally {
        dispatch({ type: 'RESTORE_TOKEN', token });
      }
    };
    bootstrap();
  }, []);

  const authActions = {
    state,

    signIn: async (credentials) => {
      // credentials: { email, password }
      try {
        const res = await api.post('/auth/login', credentials);
        const token = res.data?.token;
        if (!token) throw new Error('No token received');
        await AsyncStorage.setItem('userToken', token);
        setAuthToken(token);
        dispatch({ type: 'SIGN_IN', token });
        return { ok: true };
      } catch (err) {
        console.warn('signIn error', err);
        return { ok: false, error: err.response?.data || err.message };
      }
    },

    signOut: async () => {
      try {
        await AsyncStorage.removeItem('userToken');
        setAuthToken(null);
      } catch (e) {
        console.warn('signOut cleanup failed', e);
      }
      dispatch({ type: 'SIGN_OUT' });
    },

    signUp: async (details) => {
      // details: { name, email, password }
      try {
        const res = await api.post('/auth/signup', details);
        const token = res.data?.token;
        if (!token) throw new Error('No token received');
        await AsyncStorage.setItem('userToken', token);
        setAuthToken(token);
        dispatch({ type: 'SIGN_IN', token });
        return { ok: true };
      } catch (err) {
        console.warn('signUp error', err);
        return { ok: false, error: err.response?.data || err.message };
      }
    }
  };

  return (
    <AuthContext.Provider value={authActions}>
      {children}
    </AuthContext.Provider>
  );
}
