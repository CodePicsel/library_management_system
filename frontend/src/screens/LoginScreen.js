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

  // Admin sign-in (existing behaviour)
  const handleAdminSignIn = async (credentials) => {
    setLoading(true);
    const res = await loginAdmin(credentials); // expects { email, password }
    setLoading(false);

    if (res.ok) {
      // only admin uses basic auth header approach
      setBasicAuth(credentials.email, credentials.password);
      await AsyncStorage.setItem(
        'basicAuthUser',
        JSON.stringify({
          role: 'admin',
          email: credentials.email,
          password: credentials.password
        })
      );
      // store role so other screens can adapt
      await AsyncStorage.setItem('userRole', 'admin');
      navigation.replace('Main'); // or admin-specific route
      return { ok: true };
    }

    return { ok: false, error: res.error };
  };

  // Student sign-in
  const handleStudentSignIn = async (credentials) => {
    // credentials may have: { email, password } (and optionally username if AuthForm collects it)
    setLoading(true);
    const res = await loginStudent(credentials);
    setLoading(false);

    if (res.ok) {
      // save minimal student info locally
      await AsyncStorage.setItem(
        'studentUser',
        JSON.stringify({
          role: 'student',
          email: credentials.email,
          username: credentials.username || credentials.email
        })
      );
      await AsyncStorage.setItem('userRole', 'student');
      navigation.replace('Main'); // or admin-specific route
      return { ok: true };
    }

    return { ok: false, error: res.error };
  };

  // choose which submit handler to pass to AuthForm
  const onSubmit = activeTab === 'admin' ? handleAdminSignIn : handleStudentSignIn;
  const submitLabel = activeTab === 'admin' ? 'Sign in as Admin' : 'Sign in as Student';

  return (
    <View style={styles.root}>
      <ImageLooper source={STOCK} loopDuration={22000} />

      <View style={styles.content}>
        {/* Tabs */}
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

        {/* title */}
        <Text style={styles.title}>Welcome{"\n"}Back</Text>

        {/* Auth form: pass submit handler and label */}
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
  tabContainer: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'flex-end',
    marginBottom: 10
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginLeft: 8
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
    color: '#072014'
  },
  tabTextInactive: {
    color: '#6b7280'
  },
  title: {
    fontSize: 40,
    fontWeight: '600',
    marginBottom: 20,
    // remove the huge top margin to keep title close to form
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
