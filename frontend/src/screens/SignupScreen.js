// screens/SignupScreen.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Alert } from 'react-native';
import AuthForm from '../components/AuthForm';
import ImageLooper from '../components/ImageLooper';
import { registerStudent } from '../services/authServices';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STOCK = require('../../assets/stock.png');

export default function SignupScreen({ navigation }) {
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (values) => {
    // values is expected to contain at least { name?, username?, email, password }
    // map name -> username if provided by AuthForm
    const payload = {
      email: values.email,
      password: values.password,
      username: values.username || values.name || values.email
    };

    // basic client-side validation
    if (!payload.email || !payload.password) {
      return { ok: false, error: 'Please provide email and password.' };
    }

    try {
      setLoading(true);
      const res = await registerStudent(payload);
      setLoading(false);

      if (!res.ok) {
        // return error so AuthForm (or caller) can display it
        return { ok: false, error: res.error };
      }

      // success: backend returns created Student object (or text). Save minimal info:
      const saved = {
        role: 'student',
        email: payload.email,
        username: payload.username,
        serverData: res.data && typeof res.data === 'object' ? res.data : undefined
      };

      await AsyncStorage.setItem('studentUser', JSON.stringify(saved));
      await AsyncStorage.setItem('userRole', 'student');

      // Navigate to student home (create StudentMain or use role-aware Main)
      navigation.navigate('Login')

      return { ok: true };
    } catch (err) {
      setLoading(false);
      return { ok: false, error: 'Unexpected error during registration.' };
    }
  };

  return (
    <View style={styles.root}>
      <ImageLooper source={STOCK} loopDuration={22000} />

      <View style={styles.content}>
        <Text style={styles.title}>Create{"\n"}account</Text>

        {/* AuthForm should call onSubmit(values) and expect a return {ok: boolean, error?: string} */}
        <AuthForm
          submitLabel="Sign up"
          onSubmit={handleSignUp}
          initial={{ name: '', username: '', email: '', password: '' }}
          loading={loading}
        />

        <View style={styles.row}>
          <Text style={styles.note}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.link}> Sign in</Text>
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
    marginTop: 200,
    color: '#0b1220',
    textAlign: 'right',
    fontFamily: Platform.OS === 'android' ? 'serif' : undefined
  },
  row: {
    flexDirection: 'row',
    marginTop: 40,
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
