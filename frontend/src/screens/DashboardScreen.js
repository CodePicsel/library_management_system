// /screens/DashboardScreen.js
import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
// import { AuthContext } from '../context/AuthContext';

export default function DashboardScreen({ navigation }) {
//   const auth = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <Text style={{ marginBottom: 16 }}>Welcome to the main app area.</Text>

      <Button title="Sign out" /**onPress={() => auth.signOut()}*/ />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, alignItems:'center', justifyContent:'center', padding:16 },
  title: { fontSize:22, marginBottom:8 }
});
