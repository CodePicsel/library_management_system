// /screens/LoginScreen.js
import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AuthForm from '../components/AuthForm';
import { AuthContext } from '../context/AuthContext';
import { loginAdmin } from '../services/authServices';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api, { setBasicAuth } from '../api/api'; // adjust path if needed


export default function LoginScreen({ navigation }) {
  const auth = useContext(AuthContext);

  const handleSignIn = async (credentials) => {
  const res = await loginAdmin(credentials);

  if (res.ok) {
    // set basic auth for subsequent axios calls
    setBasicAuth(credentials.email, credentials.password);

    // optionally persist credentials (dev only; storing raw password is insecure in production)
    await AsyncStorage.setItem('basicAuthUser', JSON.stringify({
      email: credentials.email,
      password: credentials.password
    }));

    // navigate to main app
    navigation.replace('Main');
    return { ok: true };
  }

  return { ok: false, error: res.error };
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back</Text>
      <AuthForm submitLabel="Sign in" onSubmit={handleSignIn} initial={{}} />
      <View style={styles.row}>
        <Text>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, alignItems:'center', justifyContent:'center', padding:16 },
  title: { fontSize:22, marginBottom:16 },
  row: { flexDirection:'row', marginTop:12 },
  link: { color: '#1E90FF' }
});


