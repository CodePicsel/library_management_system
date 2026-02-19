// src/components/BookCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function BookCard({ book, onPress }) {
  if (!book) return null;
  const { book_id, title, author, category, available } = book;

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={() => onPress?.(book)} style={styles.card}>
      <View style={styles.left}>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        <Text style={styles.meta}>{author}</Text>
        <Text style={styles.meta}>{category}</Text>
      </View>
      <View style={styles.right}>
        <Text style={[styles.avail, available ? styles.available : styles.unavailable]}>
          {available ? 'Available' : 'Unavailable'}
        </Text>
        <Text style={styles.id}>#{book_id ?? '-'}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
  },
  left: { flex: 1 },
  right: { alignItems: 'flex-end', marginLeft: 12 },
  title: { fontSize: 16, fontWeight: '600', color: '#0f172a', marginBottom: 6 },
  meta: { fontSize: 13, color: '#6b7280' },
  avail: { fontSize: 12, fontWeight: '700', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  available: { color: '#065f46', backgroundColor: '#bbf7d0' },
  unavailable: { color: '#991b1b', backgroundColor: '#fecaca' },
  id: { fontSize: 12, color: '#9ca3af', marginTop: 6 },
});
