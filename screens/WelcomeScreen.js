import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
import axios from 'axios';
//import { API_URL } from '@env';
import { useData  } from '../BLEContext';
import useBLE from '../useBLE';
import SpeedometerComponent from '../components/SpeedometerComponent';
import { Ionicons } from '@expo/vector-icons';

const WelcomeScreen = ({userId}) => {
  console.log(userId);
  //const { data } = useData();
  const API_URL = "192.168.2.100:5000/";
  const route = useRoute();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  //console.log(route.params);
  //const { userId } = route.params;
  // const { userId } = "";
  // console.log(userId);
  const [darkMode, setDarkMode] = useState(false);
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [longPressActive, setLongPressActive] = useState(false);
  const [speed, setSpeed] = useState(0);
  const [speedData, setSpeedData] = useState([]);
  const [maxSpeed, setMaxSpeed] = useState(0);
  const [longPressDisabled, setLongPressDisabled] = useState(false);
  const [mfData, setMfData] = useState([]);
  const [vMax, setVMax] = useState(null);
  const [displayMfData, setDisplayMfData] = useState([]);
  const [isVMaxSet, setIsVMaxSet] = useState(false);


  const longPressTimerRef = useRef(null);
  const longPressActiveRef = useRef(null);
  const lastProcessedIndex = useRef(0);

  // useEffect(() => {
  //   const processNewData = () => {
  //     const newData = data.slice(lastProcessedIndex.current);
  //     lastProcessedIndex.current = data.length;

  //     // Filter and process MF data
  //     const newMfData = newData
  //       .filter(item => item.startsWith('HF:'))
  //       .map(item => {
  //         const parts = item.split(':');
  //         if (parts.length >= 4 && parts[2] === '0') {
  //           return parts[3];
  //         }
  //         return null;
  //       })
  //       .filter(item => item !== null);

  //     setMfData(prevMfData => [...prevMfData, ...newMfData]);

  //     // Filter and extract V:Max value
  //     const maxValueItem = newData.find(item => item.startsWith('V:Max'));
  //     if (maxValueItem) {
  //       const maxParts = maxValueItem.split(' ');
  //       if (maxParts.length >= 2) {
  //         setVMax(maxParts[1].replace(',', '')); // Remove any trailing commas
  //       }
  //     }
  //   };

  //   processNewData();
  // }, [data]);


  useEffect(() => {
    // Function to update speed with delays
    const updateSpeedWithDelay = async () => {
      // Send MF:R values one by one with delay
      for (let i = displayMfData.length; i < mfData.length; i++) {
        if (isVMaxSet) break; // Stop updating if vMax is set
        setSpeed(mfData[i]);
        setDisplayMfData(prevData => [...prevData, mfData[i]]);
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1-second delay
      }

      // Send V:Max value
      if (vMax) {
        setSpeed(vMax);
        setIsVMaxSet(true); // Set the flag to true
      }
    };

    updateSpeedWithDelay();
  }, [mfData, vMax]);

  // useEffect(() => {
  //   if (isFocused) {
  //     fetchWorkoutHistory();
  //   }
  // }, [isFocused]);
  
 




  const startWorkout = () => {
    navigation.navigate('Workout', { userId });
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleLongPressIn = () => {
    if (!longPressDisabled) {
      setLongPressActive(true);
      longPressActiveRef.current = true;

      longPressTimerRef.current = setInterval(() => {
        setSpeed((prevSpeed) => {
          const newSpeed = prevSpeed + 1;
          setSpeedData((prevData) => [...prevData, newSpeed]);
          return newSpeed;
        });
      }, 100);
    }
  };

  const handleLongPressRelease = () => {
    setLongPressActive(false);
    clearInterval(longPressTimerRef.current);
    setMaxSpeed(speed);
    setSpeed(0);
    setLongPressDisabled(true);
    Alert.alert('Long Press Action', 'You have completed the long press action.');
  };


  return (
    <View style={[styles.container, darkMode && styles.darkContainer]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hold on Tight!</Text>
        <TouchableOpacity onPress={toggleDarkMode}>
          <Ionicons name="moon" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.speedometer}>
        <SpeedometerComponent value={speed} />
      </View>
      <View style={styles.metricsContainer}>
        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>Max</Text>
          <Text style={styles.metricValue}>{maxSpeed} kg</Text>
        </View>
        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>Avg</Text>
          <Text style={styles.metricValue}>17 kg</Text>
        </View>
      </View>
      <View style={styles.buttons}>
      
        <TouchableOpacity onPress={startWorkout} style={styles.startButton}>
          <Text style={styles.startButtonText}>Start Workout</Text>
        </TouchableOpacity>
       
        <TouchableOpacity
          style={[styles.startButton, longPressDisabled && styles.disabledButton]}
          onPressIn={handleLongPressIn}
          onPressOut={handleLongPressRelease}
          disabled={longPressDisabled}
        >
          <Text style={styles.pressButtonText}>Max Test</Text>
        </TouchableOpacity>
        
      </View>
      
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  darkContainer: {
    backgroundColor: '#333',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  speedometer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  metricBox: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 16,
    color: '#888',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  startButton: {
    backgroundColor: '#00b894',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 18,
  },
  pressButtonText: {
    color: '#ffffff',
    fontSize: 18,
  },
  disabledButton: {
    backgroundColor: '#00b89477',
  },
  
});

export default WelcomeScreen;
