import React from 'react';
import { Button, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';

const Main = () => {
    const navigation = useNavigation();

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Welcome to MemoPattern!</Text>
            <Text>Remember the pattern and recreate it to win!</Text>
            <Button
                title="Play Game"
                onPress={() => {
                    router.push('/game/drawer');
                }}
            />
        </View>
    );
};

export default Main;
