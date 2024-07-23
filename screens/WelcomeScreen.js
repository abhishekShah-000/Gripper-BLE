import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Animated } from 'react-native';
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import { API_URL } from '@env';
import { useSelector, useDispatch } from 'react-redux';
import { setMaxStrength, setSpotlightActive, resetState } from '../src/store/userSlice';
import { loadData, saveData,resetAsyncStorage } from '../components/asyncStorageUtils';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import SpeedometerComponent from '../components/SpeedometerComponent';

import { color } from 'react-native-reanimated';

const WelcomeScreen = () => {
  
  const insets = useSafeAreaInsets();
  const token = useSelector((state) => state.user.token);
  const dispatch = useDispatch();
  const route = useRoute();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [darkMode, setDarkMode] = useState(false);
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
  const [averageStrength, setAverageStrength] = useState(0);
  const [tutorialEnabled, setTutorialEnabled] = useState(true);
  const [isSpotlightActive, setIsSpotlightActive] = useState(loadData('isSpotlightActive'));

  const [highlightState, setHighlightState] = useState([true,false]); // [highlightStartWorkout, highlightMaxTest]
  const [scaleValue] = useState(new Animated.Value(1));
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
  
  const longPressTimerRef = useRef(null);
  const longPressActiveRef = useRef(null);
  const userId = useSelector((state) => state.user.userId);
  const maxStrength = useSelector((state) => state.user.maxStrength);
  useEffect(() => {
    animateBreathing();
  }, [highlightState]);
  const animatedStyle = {
    transform: [{ scale: scaleValue }],
    zIndex:100,
  };
  const highlightButton = (index) => {
    setHighlightState((prevState) => prevState.map((state, i) => i === index));
  };
  useEffect(() => {
    
    const loadInitialData = async () => {
      await resetAsyncStorage();
      dispatch(resetState());
      const spotlightActive = await loadData('isSpotlightActive');
      if (spotlightActive !== null) {
        dispatch(setSpotlightActive(spotlightActive));
        setIsSpotlightActive(spotlightActive);
      }
      console.log("from storage:",spotlightActive);
      // Load other initial data as needed
    };

    loadInitialData();
  }, [dispatch]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log(`http://${API_URL}/users/maxStrength/${userId}`);
        const response = await axios.get(`http://${API_URL}/users/maxStrength/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = response.data;
        console.log("max data:", data);

        if (Array.isArray(data)) {
          const totalStrength = data.reduce((sum, item) => sum + item.strength, 0);
          const avgStrength = data.length > 0 ? totalStrength / data.length : 0;

          setAverageStrength(avgStrength);
          dispatch(setMaxStrength(data));

          const sortedData = [...data].sort((a, b) => new Date(b.time) - new Date(a.time));
          //console.log('Sorted data:', sortedData);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, [userId, dispatch]);

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
  const handleSkip = async () => {
    setIsSpotlightActive(false);
    dispatch(setSpotlightActive(false));
    await saveData('isSpotlightActive', false);
  };


  return (
    
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={[styles.container, darkMode && styles.darkContainer]}>
      {isSpotlightActive && (
  <TouchableOpacity 
  style = {{zIndex:50,}}
  onPress={handleSkip}>
    <Text style={styles.skipStyle}>
      Skip
    </Text>
  </TouchableOpacity>
)}
        <View style= {[isSpotlightActive && styles.overlay]}/>
        
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
        {isSpotlightActive && highlightState[0] && (<Text style = {[isSpotlightActive, highlightState[0] && styles.highligtedText]}>
          Test your max now!
          </Text>)}
          {isSpotlightActive && highlightState[1]&& (<Text style = {[isSpotlightActive, highlightState[1] && styles.highligtedText]}>
          Start yout workout now!
          </Text>)}
          <SpeedometerComponent value={speed} />
        </View>
        <View style={styles.metricsContainer}>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>Max</Text>
            <Text style={styles.metricValue}>{maxSpeed} kg</Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>Avg</Text>
            <Text style={styles.metricValue}>{averageStrength.toFixed(2)}</Text>
          </View>
        </View>
        <View style={styles.buttons}>
        <Animated.View style={isSpotlightActive&& highlightState[1] && animatedStyle}>
        <TouchableOpacity
  style={[styles.startButton, isSpotlightActive && highlightState[1] && styles.highlightedButton]}
  onPress= {()=>
  {
    setIsSpotlightActive(false);
    navigation.navigate("Workout");
  }
  }>
  <Text style={styles.startButtonText}>Start Workout</Text>
</TouchableOpacity>

       </Animated.View>
       <Animated.View style={isSpotlightActive && highlightState[0] && animatedStyle}>
  <TouchableOpacity
    style={[styles.startButton, isSpotlightActive && highlightState[0] && styles.highlightedButton]}
    onPress={() => highlightButton(1)}
    onPressIn={handleLongPressIn}
    onPressOut={handleLongPressRelease}
    disabled={longPressDisabled}
  >
    <Text style={styles.pressButtonText}>Max Test</Text>
  </TouchableOpacity>
</Animated.View>


        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, .8)',
    zIndex: 5,
    flex: 1,
  },
  skipStyle:
  {
    fontSize:16,
    zIndex:50,
    color:'white',
    justifyContent:'flex-end',
    alignSelf:'flex-end',
    margin:10
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    zIndex:0,
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
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
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
  highlightedButton: {
    backgroundColor: '#00b894',
    borderColor: 'yellow',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    zIndex:100,
  },
  highligtedText:
  {
    fontSize:24,
    color:'white',
    zIndex:100,
  },
  tutorialButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  tutorialButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WelcomeScreen;
