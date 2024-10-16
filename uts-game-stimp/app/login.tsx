import * as React from 'react';
import { Card, Button } from "@rneui/base";
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { useAuth } from './authContext';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Login() {
    const { login } = useAuth();
    const [username, setUsername] = useState(''); 
    const [password, setPassword] = useState(''); 


    const styles = StyleSheet.create({
        input: {
            height: 40,
            width: 200,
            borderWidth: 1,
            padding: 10,
        },
        button: {
            height: 40,
            width: 200,
        },
        viewRow: {
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: 'center',
            paddingRight: 50,
            margin: 3
        }
    });
    
    const doLogin = async () => {
        if (username.trim()) {
          try {
            await AsyncStorage.setItem('username', username);
            alert('Login successful');
            login(username); 
          } catch (e) {
            console.error('Error saving data to AsyncStorage', e);
          }
        } else {
          alert('Please enter a username');
        }
      };
    

    return (
        <Card>
            <Card.Title>Silakan Login</Card.Title>
            <Card.Divider />
            <View style={styles.viewRow}>
                <Text>Username </Text>
                <TextInput style={styles.input} onChangeText={(text) => setUsername(text)} value={username}
  />
            </View>
            <View style={styles.viewRow}>
                <Text>Password </Text>
                <TextInput secureTextEntry={true} style={styles.input} onChangeText={(text) => setPassword(text)} value={password}
                />
            </View>
            <View style={styles.viewRow}>
                <Button style={styles.button} title="Submit" onPress={()=>{doLogin()}}/>
            </View>
        </Card>
    );
}


export default Login;
