import { useAuth } from '../authContext'; // Import the useAuth hook
import { router, useGlobalSearchParams, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Score = () => {
  const { username } = useAuth(); // Get the username from the authentication context
  const [currentScore, setCurrentScore] = useState<number | null>(null); // State to hold current score

  useEffect(() => {
    const fetchCurrentScore = async () => {
      try {
        const storedScores = await AsyncStorage.getItem('score');
        setCurrentScore(storedScores);
        // if (storedScores) {
        //   const scores = JSON.parse(storedScores);
        //   const userScore = scores.find((scoreObj: any) => scoreObj.playerName === username);
        //   setCurrentScore(userScore ? userScore.score : null); // Set the current score if it exists
        // }
      } catch (error) {
        console.error('Error fetching high scores', error);
      }
    };

    fetchCurrentScore();
  }, [username]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Score:</Text>
      {username && <Text style={styles.usernameText}>Username: {username}</Text>} {/* Display the username */}
      {currentScore !== null ? ( // Check if current score exists
        <Text style={styles.scoreText}>Score: {currentScore}</Text>
      ) : (
        <Text style={styles.noScoreText}>No score available.</Text>
      )}
      <Button onPress={() => router.replace('/game/grid')}>Play Again</Button>
      <Button onPress={() => router.navigate('/game/highscore')}>HighScore</Button>
      <Button onPress={() => router.navigate('/main')}>Main Menu</Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F0F0F0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  usernameText: {
    fontSize: 18,
    marginBottom: 10,
    fontStyle: 'italic',
  },
  scoreText: {
    fontSize: 18,
    marginVertical: 5,
  },
  noScoreText: {
    fontSize: 16,
    color: 'gray',
    marginVertical: 5,
  },
});

export default Score;
