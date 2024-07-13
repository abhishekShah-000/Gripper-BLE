import React, { useState, useEffect } from 'react';
import { Text, View, Image, StyleSheet, Animated } from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';

const SpeedometerComponent = ({ value, imageStyle }) => {
  const formattedValue =90;
  const [rotation] = useState(new Animated.Value(0));
  const [rotationValue, setRotationValue] = useState(0);
  const [inactiveStrokeColorValue, setInactiveStrokeColorValue] = useState(new Animated.Value(0));

  useEffect(() => {
    const normalizedValue = value / 100; // Normalize value to 0-1 range
    setInactiveStrokeColorValue(new Animated.Value(normalizedValue));
  }, [value]);

  return (
    <View style={styles.container}>
      <CircularProgress
        radius={90} // Adjust radius as needed
        value={formattedValue}
        textColor='#222'
        fontSize={20}
        inActiveStrokeColor="#1BB3FF"
        inActiveStrokeOpacity={0.2}
        inActiveStrokeWidth={20}
        duration={1000}
        style={styles.circularProgress}
      />
      <Image source={require('../assets/circle.png')} style={[styles.overlay, imageStyle]} />
      <Image source={require('../assets/marks.png')} style={[styles.marks, imageStyle]} />
      <View style={styles.textContainer}>
        <Text style={styles.textStyle}>{formattedValue}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circularProgress: {
    position: 'absolute',
  },
  overlay: {
    position: 'absolute',
    top:15,
    width: 150,
    height: 150,
    zIndex: 0,
  },
  marks: {
    position: 'absolute',
    top:-25,
    width: 250,
    height: 250,
    zIndex: 1,
  },
  textContainer: {
    alignItems: 'center',
    top:-120,
  },
  textStyle: {
    color: '#1BB3FF',
    fontSize: 50,
    fontWeight: 'bold',
  },
});

export default SpeedometerComponent;
