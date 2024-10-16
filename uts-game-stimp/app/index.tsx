import { Button, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { ScrollView, GestureHandlerRootView } from "react-native-gesture-handler";
import { useRouter } from 'expo-router';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "./authContext";

export default function Index() {
  const router = useRouter();
  const [username, setUsername] = useState<string>('');
  const { logout } = useAuth();

  const cekLogin = async () => {
    try {
      const value = await AsyncStorage.getItem('username');
      if (value !== null) {
        setUsername(value);
      } else {
        setUsername('');
        logout(); 
      }
    } catch (e) {
      console.error('Error reading username from AsyncStorage', e);
      setUsername('');
      logout(); 
    }
  };

  const doLogout = async () => {
    try {
      await AsyncStorage.removeItem('username');
      alert('logged out');
      logout(); 
    } catch (e) {
      console.error('Error during logout', e);
    }
  };

  useEffect(() => {
    cekLogin();
  }, []);

  useEffect(() => {
    if (username) {
      router.push('/main');
    }
  }, [username]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Button title="Logout" onPress={doLogout} />
    </View>
  );
}
