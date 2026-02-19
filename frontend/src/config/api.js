// src/config/api.js
import { Platform } from 'react-native';

// Local emulator host for Android AVD; use localhost on iOS simulator if needed
const LOCAL_ANDROID_HOST = 'http://10.0.2.2:8080';
const LOCAL_IOS_HOST = 'http://localhost:8080';

// Production backend (Railway)
const PROD_HOST = 'https://lively-nourishment-production-bfe8.up.railway.app';

export const API_BASE_URL = LOCAL_ANDROID_HOST;
  
// export const API_BASE_URL = PROD_HOST;
