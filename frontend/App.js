// App.js
import 'react-native-gesture-handler';
import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthStack from './src/navigation/AuthStack';
import MainStack from './src/navigation/MainStack';

// Optional: if you already have AuthProvider, wrap here instead of plain fragment
// import { AuthProvider } from './src/context/AuthContext';

const RootStack = createNativeStackNavigator();

export default function App() {
  return (
    // If you have AuthProvider, wrap <AuthProvider> around <NavigationContainer>
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {/* Auth root (stack with login/signup screens) */}
        <RootStack.Screen name="Auth" component={AuthStack} />
        {/* Main root (your app after login) */}
        <RootStack.Screen name="Main" component={MainStack} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' }
});
