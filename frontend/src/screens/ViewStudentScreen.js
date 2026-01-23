// src/screens/StudentsScreen.js
import React, { useCallback, useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  StatusBar,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api, { setBasicAuth } from '../api/api';
import StudentCard from '../components/StudentCard';

export default function StudentsScreen({ navigation }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const restoreAuthIfPresent = async () => {
    try {
      const raw = await AsyncStorage.getItem('basicAuthUser');
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed?.email && parsed?.password) {
        setBasicAuth(parsed.email, parsed.password);
      }
    } catch (e) {
      console.warn('StudentsScreen restoreAuth error', e);
    }
  };

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError(null);
    await restoreAuthIfPresent();
    try {
      const res = await api.get('/admin/all-students');
      // debug
      console.log('GET /admin/all-students', res?.status, res?.data?.length);
      setStudents(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('fetchStudents error', err?.response ?? err?.message ?? err);
      setError('Failed to load students. Check server/auth/network.');
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchStudents();
    setRefreshing(false);
  }, [fetchStudents]);

  const renderEmpty = () => {
    if (loading) return <ActivityIndicator style={{ marginTop: 24 }} />;
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>{error ?? 'No students found'}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <View style={styles.header}>
        <Text style={styles.title}>Students</Text>
      </View>

      <FlatList
        data={students}
        keyExtractor={(item) => String(item?.student_id ?? item?.email ?? Math.random())}
        renderItem={({ item }) => <StudentCard student={item} onPress={() => { /* optional */ }} />}
        contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
        ListEmptyComponent={renderEmpty}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { paddingHorizontal: 16, paddingTop: Platform.OS === 'ios' ? 18 : 12, paddingBottom: 8, backgroundColor: '#F8FAFC' },
  title: { fontSize: 22, fontWeight: '700', color: '#0f172a' },
  empty: { marginTop: 30, alignItems: 'center' },
  emptyText: { color: '#64748b' },
});
