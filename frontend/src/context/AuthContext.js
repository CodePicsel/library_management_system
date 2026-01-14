import React, { createContext, useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api, { setBasicAuth, clearAuth } from '../api/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {

  const signIn = async ({ email, password }) => {
    try {
      // username == email in your backend
      setBasicAuth(email, password);

      // test auth with any protected endpoint
      await api.get('/'); 

      await AsyncStorage.setItem('basicUser', email);
      return { ok: true };
    } catch (err) {
      clearAuth();
      return {
        ok: false,
        error: 'Invalid username ddr password'
      };
    }
  };

  const signOut = async () => {
    clearAuth();
    await AsyncStorage.removeItem('basicUser');
  };

  return (
    <AuthContext.Provider value={{ signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
