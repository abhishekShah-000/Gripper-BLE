import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { API_URL } from '@env';
import { useSelector } from 'react-redux';

const WorkoutScreen = ({ route }) => {
  const userId = useSelector((state) => state.user.userId);
  const token = useSelector((state) => state.user.token);
  const [workouts, setWorkouts] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [isSpotlightActive, setIsSpotlightActive] = useState(true);
  const [highlightState, setHighlightState] = useState([true,true]); // Track which workout is highlighted

  const navigation = useNavigation();
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
    fetchWorkouts();
  }, []);

  const highlightButton = (index) => {
    setHighlightState((prevState) => prevState.map((state, i) => i === index));
  };

  const fetchWorkouts = async () => {
    try {
      const response = await axios.get(`http://${API_URL}/Protocol`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setWorkouts(response.data);
    } catch (error) {
      console.error('Error fetching workouts:', error);
    }
  };

  const handleOptionPress = (option) => {
    setSelectedOption(option);
    setSelectedLevel(null); // Reset selected level when a new workout option is selected
  };

  const handleLevelPress = (level) => {
    if(isSpotlightActive)
    {
      setIsSpotlightActive(false);
    }
    setSelectedLevel(level);
    navigation.navigate('Main', { protocol: selectedOption, level, userId });
  };

  const getImageSource = (imagePath) => {
    switch (imagePath) {
      case 'AHAP.png':
        return require('../assets/AHAP.png');
      case 'AWP.png':
        return require('../assets/AWP.png');
      case 'BBP.png':
        return require('../assets/BBP.png');
      case 'RCP.png':
        return require('../assets/RCP.png');
      default:
        return require('../assets/AHAP.png');
    }
  };

  const renderWorkoutButton = (workout) => {
    console.log(highlightState[0]);
    const isHighlighted =    workout.protocolName === 'AHAProtocol';
    return (
      <Animated.View style={ isSpotlightActive&& isHighlighted && highlightState[0] && animatedStyle }>
        <TouchableOpacity
          style={[styles.optionButton, isHighlighted && highlightState[0] && styles.highlightedButton]}
          onPress={() => handleOptionPress(workout.protocolName)}
          onLongPress={() => isHighlighted && highlightState[0] && highlightButton(1)}
          onPressOut={() => isHighlighted && highlightState[0] && highlightButton(1)}
        >
          
          <Image source={getImageSource(workout.protocolImg)} style={styles.optionImage} />
          <Text style={[styles.optionText, isHighlighted && highlightState[0] && styles.highlightedText]}>{workout.protocolName}</Text>
         
        </TouchableOpacity>
        </Animated.View>
       
    );
  };

  return (
    <View style={styles.container}>
      {!selectedOption && <Text style={styles.heading}>Select Workout</Text>}
      <View style={[isSpotlightActive && styles.overlay]} />
      <View style={[styles.optionsContainer, selectedOption && styles.hideOptions]}>
        {workouts.map(renderWorkoutButton)}
      </View>
      {selectedOption && (
        <View style={styles.levelsMainContainer}>
          <Text style={styles.subheading}>Choose difficulty level</Text>
          <View style={styles.levelsContainer}>
          <Animated.View style={isSpotlightActive &&  highlightState[1] && animatedStyle }>
            <TouchableOpacity style={[styles.levelButton,isSpotlightActive &&  highlightState[1] && styles.highlightedButton]} onPress={() => handleLevelPress('Easy')}>
              <Text style={styles.levelText}>Beginner</Text>
            </TouchableOpacity>
            </Animated.View>
            <TouchableOpacity style={styles.levelButton} onPress={() => handleLevelPress('Medium')}>
              <Text style={styles.levelText}>Intermediate</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.levelButton} onPress={() => handleLevelPress('Hard')}>
              <Text style={styles.levelText}>Expert</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, .8)',
    zIndex: 5,
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    color: 'black',
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  highlightedButton: {
    justifyContent:'center',
    borderColor: 'yellow',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    zIndex:100,
  },
  highlightedText:
  {
    color:'white'
  },
  subheading: {
    fontSize: 30,
    marginBottom: 10,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionButton: {
    alignItems: 'center',
    width: 180,
    height: 180,
    borderRadius: 10,
    overflow: 'hidden',
    margin: 10,
  },
  optionImage: {
    width: '100%',
    height: '80%',
  },
  optionText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  levelsMainContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  levelsContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  levelButton: {
    paddingHorizontal: 80,
    paddingVertical: 20,
    backgroundColor: '#43A1A4',
    borderRadius: 30,
    margin: 10,
  },
  levelText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  hideOptions: {
    display: 'none',
  },
});

export default WorkoutScreen;
