import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button, LinearProgress } from '@rneui/themed';
import { router } from 'expo-router';

interface GridProps {
  rows: number;
  columns: number;
  highlightedKotak?: number[];
  onLevelUp: () => void;
  numberCorrect: number;
  resetTimerGame: () => void;
  addScore: (points: number) => void;
}

const Grid: React.FC<GridProps> = ({ rows, columns, highlightedKotak = [], onLevelUp, numberCorrect = 3, resetTimerGame, addScore }) => {
  const [activeKotak, setActiveKotak] = useState<number[]>([]);
  const [incorrectKotak, setIncorrectKotak] = useState<number[]>([]);
  const [correctGuessCount, setCorrectGuessCount] = useState<number>(0);
  const boxSize = 50;

  useEffect(() => {
    // Set the provided highlighted kotak as active
    setActiveKotak(highlightedKotak);
    setIncorrectKotak([]); // Reset incorrect kotak

    // Change color back after 3 seconds
    const timer = setTimeout(() => {
      setActiveKotak([]);
      setIncorrectKotak([]);
    }, 3000);

    // Cleanup timer on component unmount or when effect is rerun
    return () => clearTimeout(timer);
  }, [highlightedKotak]);

  const handleBoxPress = (index: number) => {
    if (highlightedKotak.includes(index)) {
      // If clicked box is supposed to be highlighted, add it to active kotak
      setActiveKotak((prevKotak) => [...prevKotak, index]);
      
      setCorrectGuessCount((prevCount) => {
        const newCount = prevCount + 1;
        addScore(5);
        if(newCount == numberCorrect){
          setCorrectGuessCount(0);
          setActiveKotak([]);
          resetTimerGame();
          onLevelUp();
        }
        return newCount;
      })
    } else {
      // Otherwise, add to incorrect kotak to turn it red
      setIncorrectKotak((prevKotak) => [...prevKotak, index,]);
      addScore(-10);
    }
  };

  return (
    <View style={[styles.container, { width: columns * boxSize + 10, height: rows * boxSize + 10 }]}>
      {Array.from({ length: rows * columns }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.box,
            {
              width: boxSize - 10,
              height: boxSize - 10,
              backgroundColor: activeKotak.includes(index)
                ? 'green' // Green if it's part of activeKotak
                : incorrectKotak.includes(index)
                ? 'red' // Red if it's an incorrect selection
                : 'gray', // Default color
            },
          ]}
        >
          <View style={styles.buttonContainer}>
            <Button size='lg'
              title=""
              onPress={() => handleBoxPress(index)}
              color="transparent"
            />
          </View>
        </View>
      ))}
    </View>
  );
};

const App: React.FC = (navigation) => {
  const [level, setLevel] = useState<number>(1);
  const [timerGame, setTimerGame] = useState<number>(30);
  const [score, setScore] = useState<number>(0);
  const numberCorrect = 3 + (level - 1);

  const generateLevel = () => {
    if(level == 1){
      return {rows: 3, columns: 3};
    }
    else if(level == 2){
      return {rows: 3, columns: 4};
    }
    else if(level == 3){
      return {rows: 3, columns: 5};
    }
    else if(level == 4){
      return {rows: 4, columns: 5};
    }
    else if(level == 5){
      return {rows: 5, columns: 5};
    }
  };

  const { rows, columns } = generateLevel();

  const handleLevelup = () => {
    if(level < 5){
      setLevel((prevLevel) => prevLevel + 1);
    }
    else {
      console.log('Conratulations! You have complete the game.');
      alert('Conratulations! You have complete the game.');
      router.push({
        pathname: '/game/score',
        params: {skor: score}
      })
    }
  };

  const resetTimerGame = () => {
    setTimerGame(30); // Reset the timer back to 30 seconds
  };

  const addScore = (points: number) => {
    setScore((prevScore) => prevScore + points);
  };

  useEffect(() => {
    if (timerGame > 0) {
      const interval = setInterval(() => {
        setTimerGame((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => clearInterval(interval); // Cleanup interval on component unmount or timer change
    } else {
      console.log('Time is up!');
      // Handle what happens when time is up, e.g., reset the level or show a message.
      setTimerGame(30); // Reset the timer for another attempt if needed
    }
  }, [timerGame]);

  // const generateCorrectAnswer = (rows: number, columns: number) => {
  //   const totalBox = rows * columns;
  //   const highlighted = new Set<number>();
  //   while (highlighted.size < numberCorrect) {
  //     highlighted.add(Math.floor(Math.random() * totalBox));
  //   }
  //   return Array.from(highlighted);
  // };

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
      <LinearProgress
            animation={false}
            value={timerGame / 30}
            color="primary"
          />
          <Text>{toHHMMSS(timerGame)}</Text>
      <Text style={styles.levelText}>Level {level}</Text>
      <Grid rows={rows} columns={columns} highlightedKotak={highlightedKotak} onLevelUp={handleLevelup} numberCorrect={numberCorrect} resetTimerGame={resetTimerGame} addScore={addScore} />
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
  button: {
    width: '100%',
    height: '100%',
  },
  levelText: {
    marginBottom: 10,
  },
  timerText: {
    marginBottom: 20,
    color: 'red',
  },
  scoreText: {
    marginBottom: 20,
    color: 'blue',
  },
});

function toHHMMSS(v) {
  const sec_num = parseInt(v, 10);
  const hours = Math.floor(sec_num / 3600);
  const minutes = Math.floor((sec_num - hours * 3600) / 60);
  const seconds = sec_num - hours * 3600 - minutes * 60;
  const hours_str = hours < 10 ? "0" + hours : hours;
  const minutes_str = minutes < 10 ? "0" + minutes : minutes;
  const seconds_str = seconds < 10 ? "0" + seconds : seconds;
  return hours_str + ":" + minutes_str + ":" + seconds_str;
}

export default App;
