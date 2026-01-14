// screens/LoginScreen.js
import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Dimensions } from 'react-native';
import AuthForm from '../components/AuthForm';
import { AuthContext } from '../context/AuthContext';
import { loginAdmin } from '../services/authServices';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setBasicAuth } from '../api/api';
import ImageLooper from '../components/ImageLooper';

const STOCK = require('../../assets/stock.png');
const { width: WINDOW_WIDTH } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const auth = useContext(AuthContext);

  const handleSignIn = async (credentials) => {
    const res = await loginAdmin(credentials);

    if (res.ok) {
      setBasicAuth(credentials.email, credentials.password);
      await AsyncStorage.setItem(
        'basicAuthUser',
        JSON.stringify({
          email: credentials.email,
          password: credentials.password
        })
      );
      navigation.replace('Main');
      return { ok: true };
    }

    return { ok: false, error: res.error };
  };

  return (
    <View style={styles.root}>
      <ImageLooper source={STOCK} loopDuration={22000} />

      <View style={styles.content}>
        {/* title sits closer to form now */}
        <Text style={styles.title}>Welcome{"\n"}Back</Text>

        <AuthForm submitLabel="Sign in" onSubmit={handleSignIn} initial={{}} />

        <View style={styles.row}>
          <Text style={styles.note}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.link}> Create one</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#ffffff'
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  title: {
    fontSize: 40,
    fontWeight: '600',
    marginBottom: 40,
    marginTop:300,
    color: '#0b1220',
    textAlign: 'right',
    fontFamily: Platform.OS === 'android' ? 'serif' : undefined
  },
  row: {
    flexDirection: 'row',
    marginTop: 40,      // reduced gap
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  note: {
    color: '#6b7280'
  },
  link: {
    color: '#4ade80',
    fontWeight: '600'
  }
});
