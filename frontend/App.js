// App.js
import 'react-native-gesture-handler'; // must be top
import React, { useContext } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
// import { AuthProvider, AuthContext } from './context/AuthContext';
import AuthStack from './src/navigation/AuthStack';
import MainStack from './src/navigation/MainStack';

export default function App() {
  return (
    // <AuthProvider>
      <RootNavigator />
    // </AuthProvider>
  );
}

function RootNavigator() {
  // const { state } = useContext(AuthContext);

  // show loader while restoring token
  // if (state?.isLoading) {
  //   return (
  //     <View style={styles.center}>
  //       <ActivityIndicator size="large" />
  //     </View>
  //   );
  // }

  return (
    <NavigationContainer>
      {/* {state?.userToken == null ? <AuthStack /> : <MainStack />} */}
      <AuthStack/>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' }
});
