import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Button} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import {decode, encode} from 'base-64';
if (!global.btoa) {
  global.btoa = encode;
}
if (!global.atob) {
  global.atob = decode;
}
import Login from './src/screens/Login';
import AdminPage from './src/screens/admin/index';
import Profile from './src/screens/admin/Profile';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Product from './src/screens/admin/Product';
import Notification from './src/screens/admin/Notification';
import Order from './src/screens/admin/Order';
import Message from './src/screens/admin/Message';
import Conversation from './src/screens/admin/Conversation';
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MyTabs({navigation}) {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color = 'orange', size = 24}) => {
          let iconName;
          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Product') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Notification') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          } else if (route.name === 'Order') {
            iconName = focused ? 'reader' : 'reader-outline';
          } else if (route.name === 'Message') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}>
      <Tab.Screen name="Dashboard" component={AdminPage} />
      <Tab.Screen name="Product" component={Product} />
      <Tab.Screen name="Notification" component={Notification} />
      <Tab.Screen name="Order" component={Order} />
      <Tab.Screen name="Message" component={Message} />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarVisibilityAnimationConfig: true,
          tabBarButton: props => null,
          headerShown: true,
          title: 'Profile',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <Icon
              name="arrow-back-outline"
              size={24}
              onPress={() => navigation.navigate('Dashboard')}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{headerShown: false}}>
        {/* <Stack.Screen name="Profile" component={Profile}  options={{headerShown:true, title:"Profile", headerTitleAlign:"center" }} /> */}
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="AdminHome" component={MyTabs} />
        <Stack.Screen name="Conversation" component={Conversation} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
