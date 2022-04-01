import React from 'react';
import { StyleSheet, Text } from "react-native";
import {decode, encode} from 'base-64'
if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }
import Login from "./src/screens/Login"

export default function App() {
  return (
   
    <Login></Login>

  
  );
}