// components/FloatingAddButton.js
import React, { useEffect, useState } from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function FloatingAddButton() {
  const nav = useNavigation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    async function checkRole() {
      const role = await AsyncStorage.getItem('userRole');
      setVisible(role === 'admin');
    }
    const sub = nav.addListener?.('focus', checkRole);
    checkRole();
    return () => sub?.remove?.();
  }, [nav]);

  if (!visible) return null;
  return (
    <TouchableOpacity
      style={styles.fab}
      onPress={() => nav.navigate('AddBook')}
      activeOpacity={0.85}
    >
      <Text style={styles.plus}>+</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 18,
    bottom: 28,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0A84FF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
  plus: { color: '#fff', fontSize: 28, lineHeight: 30, fontWeight: '600' },
});
