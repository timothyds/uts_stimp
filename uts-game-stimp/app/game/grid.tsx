import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from '@rneui/themed';

interface GridProps {
  rows?: number;
  columns?: number;
  highlightedKotak?: number[];
}

const Grid: React.FC<GridProps> = ({ rows = 3, columns = 3, highlightedKotak = [] }) => {
  const [activeKotak, setActiveKotak] = useState<number[]>([]);
  const [incorrectKotak, setIncorrectKotak] = useState<number[]>([]);

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
    } else {
      // Otherwise, add to incorrect kotak to turn it red
      setIncorrectKotak((prevKotak) => [...prevKotak, index]);
    }
  };

  return (
    <View style={styles.container}>
      {Array.from({ length: rows * columns }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.box,
            {
              width: 150 / columns - 10,
              height: 150 / rows - 10,
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

const App: React.FC = () => {
  const highlightedKotak: number[] = [1, 3, 8];

  return (
    <View style={styles.appContainer}>
      <Grid rows={3} columns={3} highlightedKotak={highlightedKotak} />
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
    width: 150,
    height: 150,
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
});

export default App;
