// screens/LoginScreen.js
import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Dimensions } from 'react-native';
import AuthForm from '../components/AuthForm';
import { AuthContext } from '../context/AuthContext';
import { loginAdmin, loginStudent } from '../services/authServices';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setBasicAuth } from '../api/api';
import ImageLooper from '../components/ImageLooper';

const STOCK = require('../../assets/stock.png');
const { width: WINDOW_WIDTH } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const auth = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('admin'); // 'admin' or 'student'
  const [loading, setLoading] = useState(false);

  // Admin sign-in
  const handleAdminSignIn = async (credentials) => {
    setLoading(true);
    const res = await loginAdmin(credentials);
    setLoading(false);

    if (res.ok) {
      setBasicAuth(credentials.email, credentials.password);
      await AsyncStorage.setItem(
        'basicAuthUser',
        JSON.stringify({
          role: 'admin',
          email: credentials.email,
          password: credentials.password
        })
      );
      await AsyncStorage.setItem('userRole', 'admin');
      navigation.replace('Main');
      return { ok: true };
    }

    return { ok: false, error: res.error };
  };

  // Student sign-in
  const handleStudentSignIn = async (credentials) => {
    setLoading(true);
    const res = await loginStudent(credentials);
    setLoading(false);

    if (res.ok) {
      await AsyncStorage.setItem(
        'studentUser',
        JSON.stringify({
          role: 'student',
          email: credentials.email,
          username: credentials.username || credentials.email
        })
      );
      await AsyncStorage.setItem('userRole', 'student');
      navigation.replace('Main');
      return { ok: true };
    }

    return { ok: false, error: res.error };
  };

  const onSubmit = activeTab === 'admin' ? handleAdminSignIn : handleStudentSignIn;
  const submitLabel = 'Sign In';

  return (
    <View style={styles.root}>
      <ImageLooper source={STOCK} loopDuration={22000} />

      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.title}>Welcome{"\n"}Back</Text>

        {/* Tabs (styled to feel like an input field container) */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'admin' ? styles.tabActive : styles.tabInactive]}
            onPress={() => setActiveTab('admin')}
          >
            <Text style={[styles.tabText, activeTab === 'admin' ? styles.tabTextActive : styles.tabTextInactive]}>
              Admin
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'student' ? styles.tabActive : styles.tabInactive]}
            onPress={() => setActiveTab('student')}
          >
            <Text style={[styles.tabText, activeTab === 'student' ? styles.tabTextActive : styles.tabTextInactive]}>
              Student
            </Text>
          </TouchableOpacity>
        </View>

        {/* Auth form */}
        <AuthForm submitLabel={submitLabel} onSubmit={onSubmit} initial={{}} loading={loading} />

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

  // Matches AuthForm.form + AuthForm.input geometry
  tabContainer: {
    flexDirection: 'row',

    // same as AuthForm.form
    width: 200,
    maxWidth: '85%',
    alignSelf: 'flex-end',
    marginRight: 20,

    // same as AuthForm.input
    height: 44,
    marginBottom: 12,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,

    paddingHorizontal: 6,
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  tab: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    // marginLeft: 8,
    alignSelf: 'center'
  },
  tabActive: {
    backgroundColor: '#4ade80'
  },
  tabInactive: {
    backgroundColor: 'transparent'
  },
  tabText: {
    fontWeight: '600'
  },
  tabTextActive: {
    color: '#fff'
  },
  tabTextInactive: {
    color: '#b2b5bc'
  },

  title: {
    fontSize: 40,
    fontWeight: '600',
    marginBottom: 25,
    marginTop: 250,
    color: '#0b1220',
    textAlign: 'right',
    fontFamily: Platform.OS === 'android' ? 'serif' : undefined
  },
  row: {
    flexDirection: 'row',
    marginTop: 24,
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
