// components/AuthForm.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';

export default function AuthForm({ submitLabel = 'Login', onSubmit, initial = {} }) {
  const [email, setEmail] = useState(initial.email ?? '');
  const [password, setPassword] = useState(initial.password ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await onSubmit?.({ email, password }) ?? { ok: true };
      if (!result?.ok) {
        setError(result?.error || 'Invalid credentials');
      }
    } catch (e) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: 'padding', android: null })}
      style={styles.container} // no flex here
    >
      <View style={styles.form}>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#9aa0a6"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#9aa0a6"
          secureTextEntry
          autoCapitalize="none"
          value={password}
          onChangeText={setPassword}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          onPress={handleSubmit}
          style={[styles.button, loading && styles.buttonDisabled]}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{submitLabel}</Text>}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  // NOTE: removed flex:1 so the component only takes as much space as its content
  container: {
    justifyContent: 'center'
  },

  // fixed width; height defined by content only
  form: {
    width: 300,
    maxWidth: '85%',
    alignSelf: 'flex-end',
    marginRight: 20
  },
  input: {
    width: '100%',
    height: 44,
    borderRadius: 12,
    borderWidth: 0,
    paddingHorizontal: 14,
    marginBottom: 12,
    backgroundColor: '#f1f5f9',
    color: '#0f172a'
  },

  button: {
    height: 40,
    width:100,
    borderRadius: 10,
    backgroundColor: '#4ade80',
    alignItems: 'center',
    alignSelf:'center',
    justifyContent: 'center',
    marginTop: 40
  },

  buttonDisabled: { opacity: 0.8 },
  buttonText: { color: '#fff', fontWeight: '600' },
  error: { color: '#dc2626', textAlign: 'center', marginBottom: 6 }
});
