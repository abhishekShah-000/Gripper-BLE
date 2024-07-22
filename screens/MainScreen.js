import React, { useState, useEffect, useRef  } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Animated} from 'react-native';
import SpeedometerComponent from '../components/SpeedometerComponent'; // Adjust path as per your file structure
import axios from 'axios';
import { useNavigation, useRoute} from '@react-navigation/native';
import { API_URL } from '@env';
import { useSelector,useDispatch } from 'react-redux';
import RepCounter from '../components/RepCounter'; // Adjust path if RepCounter is in a separate file
import CustomCircularProgress from '../components/CustomCircularProgress'

const MainScreen = () => {
  const route = useRoute();
  const {protocol,level} = route.params;
  const token = useSelector((state) => state.user.token);
  const userId = useSelector((state) => state.user.userId);
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

  const [isSpotlightActive, setIsSpotlightActive] = useState(true);
  const [highlightState, setHighlightState] = useState([true,false]); // Track which workout is highlighted
  const [scaleValue] = useState(new Animated.Value(1));
  const animatedStyle = {
    transform: [{ scale: scaleValue }],
    zIndex:100,
  };
  const animateBreathing = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }), 
      ])
    ).start();
  };
  useEffect(() => {
    animateBreathing();
  }, [highlightState]);
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`http://${API_URL}/ProtocolInfo/${protocol}/${level}`,
          {
            headers:
          {
            'Authorization': `Bearer ${token}`
          }
          }
        );
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
  const highlightButton = (index) => {
    setHighlightState((prevState) => prevState.map((state, i) => i === index));
  };

  const handleSwitchHand = () => {
    if(activeHand=="right" && isSpotlightActive)
    {
      console.log("hello");
      highlightButton(1);
    }
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
      <View style={[isSpotlightActive && styles.overlay]} />
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
            <Animated.View style={ isSpotlightActive && highlightState[0] && animatedStyle }>
            <TouchableOpacity 
            onPress={handleSwitchHand}
            style={[styles.handButton, highlightState[0] && styles.highlightedButton]}>
              <Text 
              style={[styles.handButtonText, activeHand === 'right' ? {color: '#43A1A4'}:styles.handButtonText]}>Right Hand</Text>
            </TouchableOpacity>
            </Animated.View>
          </View>
          <Animated.View style={[isSpotlightActive &&  highlightState[1] && animatedStyle]}>
          <TouchableOpacity 
            onPress={()=>
              {
                setIsSpotlightActive(false);
                //setHighlightState(null);
              }
            }
            style={[styles.holdNowButton, isSpotlightActive && highlightState[1] && styles.highlightedButton]}>
              <Text style={styles.handButtonText}>Hold now</Text>
            </TouchableOpacity>
            </Animated.View>
        </View>
        {/* <View style={styles.handSwitch}>
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
        </View> */}
        </View>
      <View style={styles.bottomContainer}>
        <View style={styles.timerContainer}>
        <View stle = {styles.timer}>
          <View style = {{flexDirection:'row',alignItems:'baseline'}}>
          <Text style={styles.timerText}>{activeHand === 'left' ? pressDurationLeft : pressDurationRight}</Text>
          <Text style={{fontSize:16,fontWeight:'bold',color: 'gray',}}>Sec</Text>
          </View>
          <Text style={styles.currentHand}>{activeHand}</Text>
          </View>
          <View stle = {styles.timer}>
          <View style = {{flexDirection:'row',alignItems:'baseline'}}>
          <Text style={styles.timerText}>{activeHand === 'left' ? restDurationLeft : restDurationRight}</Text>
          <Text style={{fontSize:16,fontWeight:'bold',color: 'gray',}}>Sec</Text>
          </View>
          <Text style={styles.currentHand}>Rest</Text>
          </View>
         
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
    flexGrow: 1,
    top:"15%",
    justifyContent: 'flex-start',
    alignItems: 'center',
    zIndex:20,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, .8)',
    zIndex: 5,
  },
  highlightedButton: {
    justifyContent:'center',
    borderColor: 'yellow',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    zIndex:10,
  },
  bottomContainer: {
    flexGrow:1,
    justifyContent:'center',
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
    zIndex:20,
    
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
    justifyContent:"center",
    
  },
  handButton: {    
    alignItems: 'center',
    marginHorizontal:20,
    padding: 20,
    borderRadius: 10,
    backgroundColor: 'gainsboro',
  },
  handButtonText: {
    alignSelf:'center',
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
    zIndex:100,
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
  holdNowButton:
  {
    alignContent:'center',
    justifyContent:'center',
    borderRadius: 5,
    paddingVertical:20,
    backgroundColor: 'gainsboro',
    margin:12,
  },
  timerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    //gap:30,
    width: '70%',
    //margin:30,
    //marginVertical: 10,
  },
  timer:
  {
    flexDirection:'column'
  },
  timerText: {
    fontSize: 44,
    color: 'black',
    fontWeight: 'bold',
  },
  currentHand:
  {
    color: 'gray',
    fontSize:16,
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
