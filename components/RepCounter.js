import React from 'react';
import { View, StyleSheet } from 'react-native';

const RepCounter = ({ reps }) => {
  const bars = Array.from({ length: reps }, (_, index) => index + 1);

  return (
    <View style={styles.container}>
      {bars.map((bar) => (
        <View key={bar} style={styles.bar}></View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: 8,
    marginLeft:30,
  },
  bar: {
    backgroundColor: 'pink',
    height: 20,
    width: 20,
    marginHorizontal: 5,
    borderRadius: 30,
  },
});

export default RepCounter;