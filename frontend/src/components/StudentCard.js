// src/components/StudentCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';

export default function StudentCard({ student, onPress, onSetFine }) {
  if (!student) return null;
  const { student_id, username, email, fine, role } = student;

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={() => onPress?.(student)}>
      <View style={styles.left}>
        <Text numberOfLines={1} style={styles.username}>{username ?? '—'}</Text>
        <Text numberOfLines={1} style={styles.email}>{email ?? '—'}</Text>
      </View>

      <View style={styles.right}>
        <Text style={styles.fine}>₹{(Number(fine) || 0).toFixed(2)}</Text>
        <Text style={styles.meta}>id:{student_id}</Text>

        {/* Set Fine button (small) */}
        <TouchableOpacity
          style={styles.fineBtn}
          activeOpacity={0.85}
          onPress={() => onSetFine?.(student)}
        >
          <Text style={styles.fineBtnText}>Set Fine</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#dffaeb',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#6eff8d',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: Platform.OS === 'ios' ? 0.06 : 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  left: { flex: 1, paddingRight: 10 },
  right: { alignItems: 'flex-end', minWidth: 100 },
  username: { fontSize: 25, fontWeight: '600', color: '#0f172a' },
  email: { fontSize: 13, color: '#475569', marginTop: 4 },
  fine: { color: '#dc2626', fontWeight: '800', fontSize: 14 },
  meta: { fontSize: 12, color: '#94a3b8', marginTop: 6 },

  fineBtn: {
    marginTop: 8,
    backgroundColor: '#e1887b',
    borderWidth: 1,
    borderColor: '#ff8d8d',
    paddingHorizontal: 8,
    paddingVertical: 6,
    elevation:3,
    borderRadius: 8,
  },
  fineBtnText: { fontSize: 12, fontWeight: '700', color: '#ffffff' },
});
