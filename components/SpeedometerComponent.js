import React, { useState, useEffect } from 'react';
import { Text, View, Image, StyleSheet, Animated } from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';
import { max } from 'react-native-reanimated';

const SpeedometerComponent = ({ value, imageStyle, minVal, maxVal }) => {
  console.log(minVal,maxVal);
  const formattedValue =30;
  const [rotation] = useState(new Animated.Value(0));
  const [rotationValue, setRotationValue] = useState(0);
  const [inactiveStrokeColorValue, setInactiveStrokeColorValue] = useState(new Animated.Value(0));

  useEffect(() => {
    const normalizedValue = value / 100; // Normalize value to 0-1 range
    setInactiveStrokeColorValue(new Animated.Value(normalizedValue));
  }, [value]);
  const getActiveStrokeColor = (value) => {
    if (value <= minVal) {
      return '#FF2A00'; //red
    } else if (value >= minVal && value<maxVal) {
      return '#019563'; // Green
    } else if(minVal && maxVal){
      return '#FFA722'; // YEllow
    }
    else{
      return "#1BB3FF";
    }
  };

  return (
    <View style={styles.container}>
      <CircularProgress
        radius={90} // Adjust radius as needed
        value={formattedValue}
        textColor='#222'
        fontSize={20}
        activeStrokeColor={getActiveStrokeColor(formattedValue)}
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
