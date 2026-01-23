// /navigation/MainStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from '../screens/DashboardScreen';
import AddBookScreen from '../screens/AddBookScreen';
import ViewStudentScreen from '../screens/ViewStudentScreen' 

const Stack = createNativeStackNavigator();

export default function MainStack() {
  return (
    <Stack.Navigator initialRouteName="Dashboard">
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="AddBook" component={AddBookScreen} />
      <Stack.Screen name="ViewStudents" component={ViewStudentScreen} />
    </Stack.Navigator>
  );
}
