import { router, useGlobalSearchParams, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { View, Text } from 'react-native';
import { Button } from '@rneui/themed';

const Score = () => {
    const {skor} = useGlobalSearchParams();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Scores anda: {skor}</Text>
      <Button onPress={() => router.navigate('/game/grid')}>Play Again</Button>
      <Button onPress={() => router.navigate('/game/highscore')}>High Scores</Button>
      <Button onPress={() => router.navigate('/main')}>Main Menu</Button>
    </View>
  );
};

export default Score;
