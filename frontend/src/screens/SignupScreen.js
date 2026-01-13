// /screens/SignupScreen.js
import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AuthForm from '../components/AuthForm';
// import { AuthContext } from '../context/AuthContext';

export default function SignupScreen({ navigation }) {
//   const auth = useContext(AuthContext);

//   const handleSignUp = async (details) => {
//     const res = await auth.signUp(details);
//     return res; // { ok: true } or { ok:false, error }
//   };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create account</Text>
      <AuthForm submitLabel="Sign up" /**onSubmit={handleSignUp}*/ initial={{ name: '', email: '', password: '' }} />
      <View style={styles.row}>
        <Text>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Sign in</Text>
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
