import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Button, Image, Animated, Easing } from 'react-native';
import useBLE from '../useBLE'; // Update with the correct path
import { TouchableOpacity } from 'react-native-gesture-handler';

const BleConnectionScreen = ({navigation,route}) => {
  //const userId = route.params;
  const {
    requestPermissions,
    scanForPeripherals,
    connectToDevice,
    disconnectFromDevice,
    connectedDevice,
    deviceInRange, // New state
  } = useBLE();

  const [status, setStatus] = useState('searching'); // searching, connecting, connected
  const spinValue = new Animated.Value(0); // New animated value

  useEffect(() => {
    const setupBLE = async () => {
      const permissionsGranted = await requestPermissions();
      if (permissionsGranted) {
        scanForPeripherals();
      }
    };
    setupBLE();

    // Start the animation
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  useEffect(() => {
    if (deviceInRange && status === 'searching') {
      setStatus('connecting');
      connectToDevice(deviceInRange); // Assuming the first device is the desired one
    }
  }, [deviceInRange]);

  useEffect(() => {
    if (connectedDevice && status === 'connecting') {
      setStatus('connected');
    }
  }, [connectedDevice]);

  // Interpolating the spin value
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Connect your device</Text>
      <TouchableOpacity
      onPress={() => navigation.navigate("BottomTabs")}>
        <Text>Skip </Text>
      </TouchableOpacity>
      <View style={styles.circleContainer}>
        <View style={styles.circle}>
          {status === 'connected' && <Image source={require('../assets/tickMark.png')} style={styles.checkmark} />}
        </View>
      </View>
      {status === 'connecting' && <Text style={styles.deviceName}>Squeezer</Text>}
      <Text style={styles.status}>
        {status.charAt(0).toUpperCase() + status.slice(1)}...
      </Text>
      {status === 'connected' && (
        // <Button title="Let's start our fitness journey" onPress={() => navigation.navigate("Welcome",userId)} />
        <Button title="Let's start our fitness journey" onPress={() => navigation.navigate("BottomTabs")} />
      )}
      {(status === 'searching' || status === 'connecting') && (
        <ActivityIndicator size="large" color="#00ff00" style={styles.loader} />
      )}
      {status === 'searching' && (
        <Animated.View style={[styles.spinner, { transform: [{ rotate: spin }] }]}>
          <Image source={require('../assets/tickMark.png')} style={styles.spinnerImage} />
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backroundColor: '#fff',
    padding: 20,
  },
  header: {
    fontSize: 24,
    marginBottom: 40,
    color: '#333',
  },
  circleContainer: {
    width: 400,
    height: 400,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  circle: {
    width: 200,
    height: 400,
    borderRadius: 120,
    backgroundColor: '#00a9a5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    width: 50,
    height: 50,
  },
  deviceName: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  status: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  loader: {
    marginTop: 20,
  },
  spinner: {
    marginTop: 20,
  },
  spinnerImage: {
    width: 50,
    height: 50,
  },
});

export default BleConnectionScreen;
