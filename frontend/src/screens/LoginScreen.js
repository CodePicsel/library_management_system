// /screens/LoginScreen.js
import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AuthForm from '../components/AuthForm';
// import { AuthContext } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
//   const auth = useContext(AuthContext);

//   const handleSignIn = async (credentials) => {
//     const res = await auth.signIn(credentials);
//     return res; // { ok: true } or { ok:false, error }
//   };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back</Text>
      <AuthForm submitLabel="Sign in" /**onSubmit={handleSignIn}*/ initial={{}} />
      <View style={styles.row}>
        <Text>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, alignItems:'center', justifyContent:'center', padding:16 },
  title: { fontSize:22, marginBottom:16 },
  row: { flexDirection:'row', marginTop:12 },
  link: { color: '#1E90FF' }
});
