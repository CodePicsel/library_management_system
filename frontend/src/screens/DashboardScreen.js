// /screens/DashboardScreen.js
import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { logout } from '../services/authServices';
import { CommonActions } from '@react-navigation/native';

export default function DashboardScreen({ navigation }) {
  const confirmSignOut = () => {
    Alert.alert('Sign Out', 'Do you want to sing out?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text:'Sign out',
        style: 'destructive',
        onPress: handleSignOut
      }
    ]);
  };

  const handleSignOut = async () => {
    const res = await logout();
    if(res.ok){
       navigation.getParent()?.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Auth' }], // RootStack has a screen named "Auth"
        })
      );
    }else{
      Alert.alert('Logout failed', res.error || 'Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <Text style={{ marginBottom: 16 }}>Welcome to the main app area.</Text>

      <Button title="Sign out" onPress={confirmSignOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, alignItems:'center', justifyContent:'center', padding:16 },
  title: { fontSize:22, marginBottom:8 }
});
