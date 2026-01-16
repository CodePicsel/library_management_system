// screens/SignupScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import AuthForm from '../components/AuthForm';
import ImageLooper from '../components/ImageLooper';

const STOCK = require('../../assets/stock.png');

export default function SignupScreen({ navigation }) {
  return (
    <View style={styles.root}>
      <ImageLooper source={STOCK} loopDuration={22000} />

      <View style={styles.content}>
        <Text style={styles.title}>Create{"\n"}account</Text>

        <AuthForm submitLabel="Sign up" /*onSubmit={handleSignUp}*/ initial={{ name: '', email: '', password: '' }} />

        <View style={styles.row}>
          <Text style={styles.note}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.link}> Sign in</Text>
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
  title: {
    fontSize: 40,
    fontWeight: '600',
    marginBottom: 40,
    marginTop:200,
    color: '#0b1220',
    textAlign: 'right',
    fontFamily: Platform.OS === 'android' ? 'serif' : undefined
  },
  row: {
    flexDirection: 'row',
    marginTop: 40,
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
