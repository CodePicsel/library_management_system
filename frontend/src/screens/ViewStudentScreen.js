// src/screens/StudentsScreen.js
import React, { useCallback, useEffect, useState, useRef, useLayoutEffect } from 'react';
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
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api, { setBasicAuth } from '../api/api';
import StudentCard from '../components/StudentCard';

export default function StudentsScreen({ navigation }) {
  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
useLayoutEffect(() => {
  if (navigation?.setOptions) {
    navigation.setOptions({ headerShown: false });
  }
}, [navigation]);

  // modal for set-fine
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [fineInput, setFineInput] = useState('');

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
      setStudents(Array.isArray(res.data) ? res.data : []);
      setFiltered(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('fetchStudents error', err?.response ?? err?.message ?? err);
      setError('Failed to load students. Check server/auth/network.');
      setStudents([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchStudents();
    setRefreshing(false);
  }, [fetchStudents]);

  // SEARCH: if query is numeric -> backend lookup by id, else local filter
  const onSearch = async () => {
    const q = (query || '').trim();
    if (!q) {
      // reset
      setFiltered(students);
      return;
    }

    // numeric id search
    const numeric = /^\d+$/.test(q);
    if (numeric) {
      setSearching(true);
      await restoreAuthIfPresent();
      try {
        const res = await api.get(`/admin/students-list/${q}`);
        if (res?.status === 200 && res.data) {
          setFiltered([res.data]);
          setError(null);
        } else {
          setFiltered([]);
          setError('Student not found');
        }
      } catch (err) {
        console.error('student id search error', err?.response ?? err?.message ?? err);
        if (err?.response?.status === 404) {
          setFiltered([]);
          setError('Student not found');
        } else {
          setFiltered([]);
          setError('Search failed. Check server/auth.');
        }
      } finally {
        setSearching(false);
      }
      return;
    }

    // text search: filter local list by username or email
    const low = q.toLowerCase();
    setFiltered(
      students.filter(
        (s) =>
          (s.username ?? '').toLowerCase().includes(low) ||
          (s.email ?? '').toLowerCase().includes(low)
      )
    );
  };

  // open modal to set fine
  const openFineModal = (student) => {
    setSelectedStudent(student);
    setFineInput(String(Number(student?.fine ?? 0).toFixed(2)));
    setModalVisible(true);
  };

  const closeFineModal = () => {
    setSelectedStudent(null);
    setFineInput('');
    setModalVisible(false);
  };

  const submitFine = async () => {
    if (!selectedStudent) return;
    const fineValue = parseFloat(fineInput);
    if (Number.isNaN(fineValue) || fineValue < 0) {
      Alert.alert('Invalid', 'Enter a valid non-negative fine amount');
      return;
    }

    await restoreAuthIfPresent();
    try {
      // PUT /books/set-fine/{student_id}?fine=...
      const url = `/books/set-fine/${selectedStudent.student_id}`;
      const res = await api.put(url, null, { params: { fine: fineValue } });
      // successful: update local list
      if (res?.status === 200 || res?.status === 204) {
        // locally update
        setStudents((prev) =>
          prev.map((p) => (p.student_id === selectedStudent.student_id ? { ...p, fine: fineValue } : p))
        );
        setFiltered((prev) =>
          prev.map((p) => (p.student_id === selectedStudent.student_id ? { ...p, fine: fineValue } : p))
        );
        Alert.alert('Success', 'Fine updated');
        closeFineModal();
      } else {
        Alert.alert('Failed', `Server returned ${res?.status}`);
      }
    } catch (err) {
      console.error('submitFine error', err?.response ?? err?.message ?? err);
      let msg = 'Failed to update fine. Check server/auth.';
      if (err?.response?.data) msg = typeof err.response.data === 'string' ? err.response.data : JSON.stringify(err.response.data);
      Alert.alert('Error', msg);
    }
  };

  const renderEmpty = () => {
    if (loading || searching) return <ActivityIndicator style={{ marginTop: 24 }} />;
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

        {/* Search input */}
        <View style={styles.searchRow}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search by id, name, or email"
            style={styles.searchInput}
            returnKeyType="search"
            onSubmitEditing={onSearch}
          />
          <TouchableOpacity style={styles.searchBtn} onPress={onSearch} activeOpacity={0.85}>
            <Text style={styles.searchBtnText}>Search</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.searchBtn, styles.clearBtn]}
            onPress={() => { setQuery(''); setFiltered(students); setError(null); }}
            activeOpacity={0.85}
          >
            <Text style={[styles.searchBtnText, { color: '#0f172a' }]}>Clear</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item?.student_id ?? item?.email ?? Math.random())}
        renderItem={({ item }) => (
          <StudentCard
            student={item}
            onPress={() => { /* optional detail */ }}
            onSetFine={openFineModal}
          />
        )}
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
        ListEmptyComponent={renderEmpty}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />

      {/* Modal: set fine */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalRoot}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Set Fine</Text>
            <Text style={styles.modalSubtitle}>
              {selectedStudent?.username ?? ''} • #{selectedStudent?.student_id ?? ''}
            </Text>

            <TextInput
              keyboardType="numeric"
              value={fineInput}
              onChangeText={setFineInput}
              style={styles.modalInput}
              placeholder="Fine amount (e.g. 50.00)"
            />

            <View style={styles.modalRow}>
              <TouchableOpacity style={[styles.modalBtn, styles.cancelBtn]} onPress={closeFineModal}>
                <Text style={styles.modalBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.modalBtn, styles.saveBtn]} onPress={submitFine}>
                <Text style={[styles.modalBtnText, { color: '#fff' }]}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { paddingHorizontal: 16, paddingTop: Platform.OS === 'ios' ? 18 : 32, paddingBottom: 8, backgroundColor: '#F8FAFC' },
  title: { fontSize: 27, fontWeight: '800', color: '#0f172a', marginBottom: 12 },

  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    elevation:2,
    borderColor: '#f4fff3',
  },
  searchBtn: {
    marginLeft: 8,
    backgroundColor: '#4ade80',
    paddingHorizontal: 12,
    paddingVertical: 8,
    elevation:5,
    borderRadius: 10,
  },
  clearBtn: {
    backgroundColor: '#e6eef7',
    marginLeft: 6,
    elevation:3,
  },
  searchBtnText: { color: '#fff', fontWeight: '700' },

  empty: { marginTop: 30, alignItems: 'center' },
  emptyText: { color: '#64748b' },

  modalRoot: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.35)' },
  modalCard: { width: '88%', backgroundColor: '#fff', borderRadius: 12, padding: 16 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a' },
  modalSubtitle: { color: '#64748b', marginTop: 6, marginBottom: 12 },
  modalInput: { borderWidth: 1, borderColor: '#e6eef7', borderRadius: 8, height: 44, paddingHorizontal: 10, marginBottom: 14 },
  modalRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8 },
  modalBtn: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8 },
  cancelBtn: { backgroundColor: '#f1f5f9' },
  saveBtn: { backgroundColor: '#4ade80' },
  modalBtnText: { fontWeight: '700', color: '#0f172a' },
});
