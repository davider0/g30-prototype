import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import Constants from "expo-constants";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Button,
  Pressable,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Main } from "./app/Main";
export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark"></StatusBar>

      <Main />
    </SafeAreaProvider>
  );
}
