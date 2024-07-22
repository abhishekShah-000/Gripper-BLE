import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Image } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Popup = ({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  buttonText = 'Close', 
  height = 300, // Default height
  iconSource // New prop for the icon
}) => {
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(animation, {
      toValue: isOpen ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOpen, animation]);

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [height, 0],
  });

  const opacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  if (!isOpen && opacity._value === 0) return null;

  return (
    <View style={StyleSheet.absoluteFill}>
      <Animated.View style={[styles.blurContainer, { opacity }]}>
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType="dark"
          blurAmount={7}
          reducedTransparencyFallbackColor="white"
        />
      </Animated.View>
      <TouchableOpacity
        style={StyleSheet.absoluteFill}
        activeOpacity={1}
        onPress={onClose}
      />
      <Animated.View style={[styles.popup, { transform: [{ translateY }], height }]}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>×</Text>
        </TouchableOpacity>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.iconContainer}>
        {/* <Ionicons name="cross" size={100} color="red" /> */}
          <Image source={iconSource} style={styles.icon} />
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>{buttonText}</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  blurContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  popup: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent: 'space-between',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666',
  },
  header: {
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  icon: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  contentContainer: {
    alignItems: 'center',
  },
  message: {
    fontSize:16,
    marginBottom: 20,
    color: '#666',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#43A1A4',
    paddingVertical: 20,
    paddingHorizontal: 70,
    borderRadius: 15,
  },
  buttonText: {
    fontSize:16,
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default Popup;