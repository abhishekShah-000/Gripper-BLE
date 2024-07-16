import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import SpeedometerComponent from '../components/SpeedometerComponent'; // Adjust path as per your file structure
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
//import { API_URL } from '@env';
import RepCounter from '../components/RepCounter'; // Adjust path if RepCounter is in a separate file
import CustomCircularProgress from '../components/CustomCircularProgress'

const MainScreen = ({ route }) => {
  const API_URL = "192.168.2.117:5000/";
  const { protocol, level, userId } = route.params;
  const navigation = useNavigation();
  const [activeHand, setActiveHand] = useState('left'); // Track active hand

  const [pressDurationLeft, setPressDurationLeft] = useState(0);
  const [pressDurationRight, setPressDurationRight] = useState(0);
  const [restDurationLeft, setRestDurationLeft] = useState(0);
  const [restDurationRight, setRestDurationRight] = useState(0);
  
  const [repsLeft, setRepsLeft] = useState(0);
  const [repsRight, setRepsRight] = useState(0);

  const [thresholdPercentage, setThresholdPercentage] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [startPressDisabled, setStartPressDisabled] = useState(false);
  const [restDurationActive, setRestDurationActive] = useState(false);

  const [speedDataLeft, setSpeedDataLeft] = useState([]);
  const [speedDataRight, setSpeedDataRight] = useState([]);

  const [minThreshold, setMinThreshold] = useState(0);
  const [maxThreshold, setMaxThreshold] = useState(0);
  const [maxValue, setMaxValue] = useState(0);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [dataUpdated, setDataUpdated] = useState(false);
  const [longPressActive, setLongPressActive] = useState(false); // Track long press activity

  const [belowThresholdCount, setBelowThresholdCount] = useState(0);
  const [onThresholdCount, setOnThresholdCount] = useState(0);
  const [aboveThresholdCount, setAboveThresholdCount] = useState(0);

  const longPressTimerRef = useRef(null);
  const restTimerRef = useRef(null);
  const pressTimerRef = useRef(null);
  const longPressActiveRef = useRef(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`http://${API_URL}ProtocolInfo/${protocol}/${level}`);
        const data = response.data;
        const levelData = data.difficultyLevel[level];

        setPressDurationLeft(levelData.PressDuration || 0);
        setPressDurationRight(levelData.PressDuration || 0);
        setRestDurationLeft(levelData.RestDuration || 0);
        setRestDurationRight(levelData.RestDuration || 0);
        setMinThreshold(levelData.MinThresholdPercentage || 0);
        setMaxThreshold(levelData.MaxThresholdPercentage || 0);
        setRepsLeft(levelData.Reps || 0);
        setRepsRight(levelData.Reps || 0);
        setThresholdPercentage(levelData.ThresholdPercentage || 0);
        setMaxValue(100); // Set your maxValue based on your requirement
        setDataLoaded(true); // Set state to indicate data has been loaded

      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, [protocol, level]);

   useEffect(() => {
    const updateThresholdCounts = (speedData) => {
      let belowCount = 0;
      let onCount = 0;
      let aboveCount = 0;

      speedData.forEach((dataPoint) => {
        if (dataPoint < minThresholdValue) {
          belowCount++;
        } else if (dataPoint >= minThresholdValue && dataPoint <= maxThresholdValue) {
          onCount++;
        } else {
          aboveCount++;
        }
      });

      setBelowThresholdCount(belowCount);
      setOnThresholdCount(onCount);
      setAboveThresholdCount(aboveCount);
    };

    if (activeHand === 'left') {
      updateThresholdCounts(speedDataLeft);
    } else {
      updateThresholdCounts(speedDataRight);
    }

    setDataUpdated(true);
  }, [speedDataLeft, speedDataRight, minThresholdValue, maxThresholdValue, activeHand]);


  const handleStartPress = () => {
    if ((activeHand === 'left' && repsLeft > 0 && pressDurationLeft > 0) ||
        (activeHand === 'right' && repsRight > 0 && pressDurationRight > 0)) {
      setStartPressDisabled(true);
      clearInterval(restTimerRef.current);
      setSpeed(0);

      if (activeHand === 'left') {
        setSpeedDataLeft([]);
        pressTimerRef.current = setInterval(() => {
          setPressDurationLeft((prevDuration) => {
            if (prevDuration > 0) {
              return prevDuration - 1;
            }
            console.log("rest duration active");
            clearInterval(pressTimerRef.current);
            handleRestDuration();
            return 0;
          });
        }, 1000);
      } else {
        setSpeedDataRight([]);
        pressTimerRef.current = setInterval(() => {
          setPressDurationRight((prevDuration) => {
            if (prevDuration > 0) {
              return prevDuration - 1;
            }
            clearInterval(pressTimerRef.current);
            handleRestDuration();
            return 0;
          });
        }, 1000);
      }
    }
  };

  const calculateWorkoutStats = (belowCount, aboveCount, onCount) => {
    const belowPercentage = (belowCount / speedData.length) * 100;
    const abovePercentage = (aboveCount / speedData.length) * 100;
    const onPercentage = (onCount / speedData.length) * 100;

    console.log('below:', belowPercentage);
    console.log('above:', abovePercentage);
    console.log('on:', onPercentage);
  };

  const handleRestDuration = () => {
    setRestDurationActive(true);

    if (activeHand === 'left') {
      setPressDurationLeft(0);
      restTimerRef.current = setInterval(() => {
        setRestDurationLeft((prevDuration) => {
          if (prevDuration > 0) {
            return prevDuration - 1;
          }
          clearInterval(restTimerRef.current);
          setRepsLeft((prevReps) => prevReps - 1);
          setPressDurationLeft(pressDurationLeft);
          setRestDurationLeft(restDurationLeft);
          setStartPressDisabled(false);
          setRestDurationActive(false);
          return 0;
        });
      }, 1000);
    } else {
      setPressDurationRight(0);
      restTimerRef.current = setInterval(() => {
        setRestDurationRight((prevDuration) => {
          if (prevDuration > 0) {
            return prevDuration - 1;
          }
          clearInterval(restTimerRef.current);
          setRepsRight((prevReps) => prevReps - 1);
          setPressDurationRight(pressDurationRight);
          setRestDurationRight(restDurationRight);
          setStartPressDisabled(false);
          setRestDurationActive(false);
          return 0;
        });
      }, 1000);
    }
  };


  const handleLongPressIn = () => {
    if ((activeHand === 'left' && pressDurationLeft > 0) || 
        (activeHand === 'right' && pressDurationRight > 0)) {
      setLongPressActive(true); // Activate long press
      longPressActiveRef.current = true;
      longPressTimerRef.current = setInterval(() => {
        if (longPressActiveRef.current) { // Ensure longPressActive flag is checked
          setSpeed((prevSpeed) => {
            const newSpeed = prevSpeed + 1;
            if (activeHand === 'left') {
              setSpeedDataLeft((prevData) => [...prevData, newSpeed]);
            } else {
              setSpeedDataRight((prevData) => [...prevData, newSpeed]);
            }
            return newSpeed;
          });
        }
      }, 100);
    }
  };

  const handleLongPressRelease = () => {
    setLongPressActive(false); // Deactivate long press
    clearInterval(longPressTimerRef.current); // Clear the timer
    setSpeed(0); // Reset speed if needed
  };

  const handleCheckStats = async () => {
    navigation.navigate('Stats', { speedData });
    try {
      console.log(userId.userId);
      const response = await axios.post(`http://${API_URL}saveWorkout/`, {
        userId: userId.userId.toString(),
        protocol: protocol.toString(),
        level: level.toString(),
        leftHandData:speedDataLeft,
        rightHandData:speedDataRight
      });

      if (response.status === 200) {
        Alert.alert('Workout Saved Successfully');
        navigation.navigate('Stats', { speedData });
      }
    } catch (error) {
      console.error('Error saving workout:', error);
      Alert.alert('Error Saving Workout', 'Please try again later.');
    }
  };
  const handleSwitchHand = () => {
    setActiveHand((prevHand) => (prevHand === 'left' ? 'right' : 'left'));
  };

  if (!dataLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const minThresholdValue = 200 * (minThreshold / 100);
  const maxThresholdValue = 200 * (maxThreshold / 100);
  const maxVal = 200 * (maxValue / 100);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.speedometerContainer}>
          <View style={{ alignSelf: 'center', flexDirection: 'row', paddingBottom: 50 }}>
            <Text style={styles.setText}>Set</Text>
            <RepCounter reps={activeHand === 'left' ? repsLeft : repsRight} />
          </View>
          <SpeedometerComponent
            value={speed}
            minVal={minThresholdValue}
            maxVal = {maxThresholdValue}
          />
         
       
          <View style={styles.handSwitch}>
            <TouchableOpacity 
            onPress={handleSwitchHand}
            style={styles.handButton}>
              <Text style={[styles.handButtonText, activeHand === 'left' ? {color: '#43A1A4'}:styles.handButtonText]}>Left Hand</Text>
            </TouchableOpacity>
            <TouchableOpacity 
            onPress={handleSwitchHand}
            style={styles.handButton}>
              <Text 
              style={[styles.handButtonText, activeHand === 'right' ? {color: '#43A1A4'}:styles.handButtonText]}>Right Hand</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.handSwitch}>
          <TouchableOpacity
            style={[styles.pressButton, startPressDisabled && styles.disabledButton]}
            onPress={handleStartPress}
            disabled={startPressDisabled}
          >
            <Text style={styles.pressButtonText}>Start Press</Text>
          </TouchableOpacity>

          <TouchableOpacity
          onLongPress={handleLongPressIn}
          onPressOut={handleLongPressRelease}
          disabled={restDurationActive}
          style={[styles.pressButton, startPressDisabled && styles.disabledButton]}
        >
          <Text style={styles.pressButtonText}>Long Press</Text>
        </TouchableOpacity>
        </View>
        </View>
      <View style={styles.bottomContainer}>
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>Left {activeHand === 'left' ? pressDurationLeft : pressDurationRight} Sec.</Text>
          <Text style={styles.timerText}>Rest {activeHand === 'left' ? restDurationLeft : restDurationRight} Sec.</Text>
        </View>
        {/* <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statText}>{belowThresholdCount}%</Text>
            <Text style={styles.statLabel}>41% below</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statText}>{onThresholdCount}%</Text>
            <Text style={styles.statLabel}>41% on</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statText}>{aboveThresholdCount}%</Text>
            <Text style={styles.statLabel}>41% above</Text>
          </View>
        </View> */}
        
          <TouchableOpacity
            style={styles.checkStatsButton}
            onPress={handleCheckStats}
          >
            <Text style={styles.pressButtonText}>Check Stats</Text>
          </TouchableOpacity>
         
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    top:100,
    justifyContent: 'flex-start',
    alignItems: 'center',
   
  },
  bottomContainer: {
    
    alignItems: 'center',
    marginVertical: 20,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  speedometerContainer: {
    padding: 20,
    width: "90%",
    paddingBottom: 40,
    alignContent: "center",
    backgroundColor: "white",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 5,
  },
  setText: {
    fontSize: 24,
    color: 'black',
    fontWeight: 'bold',
  },
  pressButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
    margin: 10,
  },
  handSwitch: {
    flexDirection: 'row',
  },
  handButton: {    
    alignItems: 'center',
    marginHorizontal:20,
    padding: 20,
    borderRadius: 10,
    backgroundColor: 'gainsboro',
  },
  handButtonText: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
  },
  longPressButton: {
    backgroundColor: '#00FF00',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
    margin: 10,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  pressButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  timerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginVertical: 10,
  },
  timerText: {
    fontSize: 20,
    color: 'gray',
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    marginVertical: 20,
  },
  statBox: {
    alignItems: 'center',
  },
  statText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  statLabel: {
    fontSize: 14,
    color: 'gray',
  },
  checkStatsButton: {
    backgroundColor: '#FFA500',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
    margin: 10,
  },
});

export default MainScreen;
