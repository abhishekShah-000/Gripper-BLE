import React from 'react';
import { View, StyleSheet } from 'react-native';

const CustomCircularProgress = ({ value, divisions, strokeWidth, strokeColor, fillColor }) => {

  const circumference = 2 * Math.PI * (strokeWidth / 2); // Calculate circumference

  const markerAngleStep = 360 / divisions; // Adjust angle step based on divisions

  const getMarkerAngle = (index) => {
    // Calculate angle based on value and divisions
    const normalizedValue = value / 100; // Normalize value to 0-1 range
    const angleOffset = normalizedValue * 360; // Calculate angle offset based on value
    const markerAngle = (index * markerAngleStep) + angleOffset;
    return markerAngle;
  };

  const renderMarkers = () => {
    const markers = [];
    for (let i = 0; i < divisions; i++) {
      const angle = getMarkerAngle(i);
      markers.push(
        <View
          key={i}
          style={[styles.marker, { transform: `rotate(${angle}deg)` }]}
        />
      );
    }
    return markers;
  };

  return (
    <View style={styles.container}>
      <View style={styles.circle}>
        <View style={[styles.stroke, { borderWidth: strokeWidth, borderColor: strokeColor }]} />
        <View style={[styles.fill, { backgroundColor: fillColor }]} />
        {renderMarkers()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 100, // Adjust size as needed
    height: 100, // Adjust size as needed
    borderRadius: 50, // Adjust based on strokeWidth
    overflow: 'hidden', // Prevent markers from overflowing
  },
  stroke: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    borderStyle: 'solid',
  },
  fill: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  marker: {
    position: 'absolute',
    width: 1, // Adjust marker size (set to a small value)
    height: 100, // Adjust marker size (set to full height)
    backgroundColor: 'black', // Adjust marker color
    borderRadius: 100,
  },
});

export default CustomCircularProgress;
