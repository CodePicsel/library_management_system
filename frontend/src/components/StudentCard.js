// src/components/StudentCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';

export default function StudentCard({ student, onPress }) {
  if (!student) return null;
  const { student_id, username, email, fine, role } = student;

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={() => onPress?.(student)}>
      <View style={styles.left}>
        <Text numberOfLines={1} style={styles.username}>{username ?? '—'}</Text>
        <Text numberOfLines={1} style={styles.email}>{email ?? '—'}</Text>
      </View>

      <View style={styles.right}>
        <Text style={styles.fine}>₹{(Number(fine) || 0).toFixed(2)}</Text>
        <Text style={styles.meta}>#{student_id}</Text>
        <Text style={styles.role}>{role?.replace(/^ROLE_/, '') ?? ''}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#eef2f7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: Platform.OS === 'ios' ? 0.06 : 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  left: { flex: 1, paddingRight: 10 },
  right: { alignItems: 'flex-end', minWidth: 80 },
  username: { fontSize: 16, fontWeight: '700', color: '#0f172a' },
  email: { fontSize: 13, color: '#475569', marginTop: 4 },
  fine: { color: '#dc2626', fontWeight: '700', fontSize: 14 },
  meta: { fontSize: 12, color: '#94a3b8', marginTop: 6 },
  role: { fontSize: 11, color: '#64748b', marginTop: 4 },
});
