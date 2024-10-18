import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from '@rneui/themed';
import { router } from 'expo-router';

const HighScores = () => {
    const [highScores, setHighScores] = useState<{ playerName: string; score: number }[]>([]);

    useEffect(() => {
        const fetchHighScores = async () => {
            try {
                const storedScores = await AsyncStorage.getItem('highScores');
                if (storedScores) {
                    const scores = JSON.parse(storedScores);
                    setHighScores(scores); 
                }
            } catch (error) {
                console.error('Error fetching high scores', error);
            }
        };

        fetchHighScores();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>High Scores</Text>
            {highScores.length > 0 ? (
                <FlatList
                    data={highScores}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => (
                        <View style={styles.scoreCard}>
                            <Text style={styles.rank}>{index + 1}.</Text>
                            <Text style={styles.scoreText}>
                                {item.playerName}: {item.score}
                            </Text>
                        </View>
                    )}
                />
            ) : (
                <Text style={styles.noScoreText}>No scores available.</Text>
            )}
            <View style={styles.buttonContainer}>
                <Button onPress={() => router.navigate('/game/grid')} title="Play Again" />
                <Button onPress={() => router.navigate('/main')} title="Main Menu" />
            </View>
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
    scoreCard: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 10,
        borderRadius: 5,
        marginVertical: 5,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
    },
    rank: {
        fontSize: 20,
        fontWeight: 'bold',
        marginRight: 10,
        color: '#4CAF50',
    },
    scoreText: {
        fontSize: 18,
        color: '#333',
    },
    noScoreText: {
        fontSize: 16,
        color: 'gray',
        marginVertical: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 20,
    },
});

export default HighScores;
