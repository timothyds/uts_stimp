import React, { useState, useEffect, useMemo, useRef, MutableRefObject } from 'react';
import { View, StyleSheet, Text, Alert, Animated, Easing} from 'react-native';
import { Button, LinearProgress } from '@rneui/themed';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../authContext';

interface GridProps {
  rows: number;
  columns: number;
  highlightedKotak?: number[];
  onLevelUp: () => void;
  numberCorrect: number;
  resetTimerGame: () => void;
  addScore: (points: number) => void;
  endGame: (finalScore: number) => void; // Added prop for ending the game
  score: number;
}

const Grid: React.FC<GridProps> = ({
  rows,
  columns,
  highlightedKotak = [],
  onLevelUp,
  numberCorrect,
  resetTimerGame,
  addScore,
  endGame,
  score,
}) => {
  const [activeKotak, setActiveKotak] = useState<number[]>([]);
  const [incorrectKotak, setIncorrectKotak] = useState<number[]>([]);
  const [correctGuessCount, setCorrectGuessCount] = useState<number>(0);
  
  const boxSize = 50;

  const animations: MutableRefObject<Animated.Value[]> = useRef(Array(rows * columns).fill(null).map(() => new Animated.Value(0)));

  // Update animations whenever the grid size changes
  useEffect(() => {
    animations.current = Array(rows * columns).fill(null).map(() => new Animated.Value(0));
  }, [rows, columns]); // Depend on rows and columns


  useEffect(() => {
    setActiveKotak(highlightedKotak);
    setIncorrectKotak([]);
    
    const timer = setTimeout(() => {
      setActiveKotak([]);
      setIncorrectKotak([]);
    }, 3000);

    return () => clearTimeout(timer);
  }, [highlightedKotak]);

  const handleBoxPress = (index: number) => {
    if (highlightedKotak.includes(index)) {
      // Correct guess logic
      setActiveKotak((prevKotak) => [...prevKotak, index]);

      const animation = animations.current[index];
      if (animation) {
        Animated.timing(animation, {
          toValue: 1,
          duration: 500,
          easing: Easing.linear,
          useNativeDriver: true,
        }).start(() => {
          animation.setValue(0); // Reset the animation after completion
        });
      }

      setCorrectGuessCount((prevCount) => {
        const newCount = prevCount + 1;
        addScore(5);
        if (newCount === numberCorrect) {
          setCorrectGuessCount(0);
          setActiveKotak([]);//
          resetTimerGame();
          onLevelUp();
        }
        return newCount;
      });
    } else {
     // addScore(-10); 
      endGame(score); 
    }
  };

  const getBoxStyle = (index: number) => {
    // Ensure we are not trying to access an undefined animation
    const animation = animations.current[index];
    
    if (!animation) {
      return {
        backgroundColor: activeKotak.includes(index) ? 'green' : 'gray',
      };
    }
  
    const rotateAnimation = animation.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });
  
    return {
      transform: [{ rotate: rotateAnimation }],
      backgroundColor: activeKotak.includes(index) ? 'green' : 'gray',
    };
  };
  

  return (
    <View style={[styles.container, { width: columns * boxSize + 10, height: rows * boxSize + 10 }]}>
      {Array.from({ length: rows * columns }).map((_, index) => (
        <Animated.View
          key={index}
          style={[
            styles.box,
            getBoxStyle(index),
            {
              width: boxSize - 10,
              height: boxSize - 10,
              // backgroundColor: activeKotak.includes(index)
              //   ? 'green'
              //   : incorrectKotak.includes(index)
              //   ? 'red'
              //   : 'gray',
            },
          ]}
        >
          <View style={styles.buttonContainer}>
            <Button size='lg' title="" onPress={() => handleBoxPress(index)} color="transparent" />
          </View>
        </Animated.View>
      ))}
    </View>
  );
};

const App: React.FC = (navigation) => {
  const { username } = useAuth(); 
  const [level, setLevel] = useState<number>(1);
  const [timerGame, setTimerGame] = useState<number>(30);
  const [score, setScore] = useState<number>(0);
  const numberCorrect = 3 + (level - 1);

  const generateLevel = () => {
    if (level === 1) return { rows: 3, columns: 3 };
    if (level === 2) return { rows: 3, columns: 4 };
    if (level === 3) return { rows: 3, columns: 5 };
    if (level === 4) return { rows: 3, columns: 6 };
    if (level === 5) return { rows: 3, columns: 7 };
  };

  const { rows, columns } = generateLevel();

  const handleLevelup = () => {
    if (level < 5) {
      setLevel((prevLevel) => prevLevel + 1);
    } else {
      Alert.alert('Congratulations!', 'You have completed the game.');
      saveScore(score);
      router.push({ pathname: '/game/score', params: { skor: score } });
    }
  };

  const resetTimerGame = () => {
    setTimerGame(30);
  };

  const addScore = (points: number) => {
    setScore((prevScore) => prevScore + points);
  };

  const endGame = async (finalScore: number) => {
    Alert.alert('Game Over', `Your final score is ${finalScore}`);
    await AsyncStorage.setItem('score', finalScore.toString());
    clearInterval(timerGame);
    await saveScore(finalScore);
    router.push('/game/score'); // Navigate to score screen
  };

  const saveScore = async (finalScore: number) => {
    try {
        const storedScores = await AsyncStorage.getItem('highScores');
        const scores = storedScores ? JSON.parse(storedScores) : [];
        
        // Check if the user already has a score
        const userIndex = scores.findIndex((score: any) => score.playerName === username);
        if (userIndex !== -1) {
            if(finalScore > scores[userIndex].score){
              // Update existing score
              scores[userIndex].score = finalScore;
            }
        } else {
            // Add new score
            scores.push({ score: finalScore, playerName: username });
        }
        
        scores.sort((a: any, b: any) => b.score - a.score);
        await AsyncStorage.setItem('highScores', JSON.stringify(scores.slice(0, 3)));
    } catch (error) {
        console.error('Error saving score', error);
    }
};
  

  useEffect(() => {
    if (timerGame > 0) {
      const interval = setInterval(() => {
        setTimerGame((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      console.log('Time is up!');
      endGame(score); // End game if timer runs out
    }
  }, [timerGame]);

  const highlightedKotak: number[] = useMemo(() => {
    const totalBox = rows * columns;
    const highlighted = new Set<number>();
    while (highlighted.size < numberCorrect) {
      highlighted.add(Math.floor(Math.random() * totalBox));
    }
    return Array.from(highlighted);
  }, [level, rows, columns, numberCorrect]);

  return (
    <View style={styles.appContainer}>
      <LinearProgress animation={false} value={timerGame / 30} color="primary" />
      <Text>{toHHMMSS(timerGame)}</Text>
      <Text style={styles.levelText}>Level {level}</Text>
      <Grid
        rows={rows}
        columns={columns}
        highlightedKotak={highlightedKotak}
        onLevelUp={handleLevelup}
        numberCorrect={numberCorrect}
        resetTimerGame={resetTimerGame}
        addScore={addScore}
        endGame={endGame} // Pass the end game function
        score={score}
      />
      <Text style={styles.scoreText}>Score: {score}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#ADD8E6',
    padding: 5,
  },
  box: {
    margin: 2,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  levelText: {
    marginBottom: 10,
  },
  scoreText: {
    marginBottom: 20,
    color: 'blue',
  },
});

function toHHMMSS(v: number) {
  const sec_num = parseInt(v.toString(), 10);
  const hours = Math.floor(sec_num / 3600);
  const minutes = Math.floor((sec_num - hours * 3600) / 60);
  const seconds = sec_num - hours * 3600 - minutes * 60;
  const hours_str = hours < 10 ? '0' + hours : hours;
  const minutes_str = minutes < 10 ? '0' + minutes : minutes;
  const seconds_str = seconds < 10 ? '0' + seconds : seconds;
  return hours_str + ':' + minutes_str + ':' + seconds_str;
}

export default App;
