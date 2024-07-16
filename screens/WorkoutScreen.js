import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
//import { API_URL } from '@env';

const WorkoutScreen = ({ route }) => {
  const API_URL = "192.168.2.117:5000/";
  const userId = route.params;
  const [workouts, setWorkouts] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      console.log(`http://${API_URL}Protocol`);
      const response = await axios.get(`http://${API_URL}Protocol`);
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
    setSelectedLevel(level);
    navigation.navigate('Main', { protocol: selectedOption, level, userId }); // Navigate to MainScreen with selected level
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
      // Add more cases as needed
      default:
        return require('../assets/AHAP.png'); // Provide a default image
    }
  };

  return (
    <View>
    <View style={styles.container}>
      {!selectedOption && <Text style={styles.heading}>Select Workout</Text>}

      <View style={[styles.optionsContainer, selectedOption && styles.hideOptions]}>
        {workouts.map((workout) => (
          <TouchableOpacity
            key={workout._id}
            style={styles.optionButton}
            onPress={() => handleOptionPress(workout.protocolName)}
          >
            <Image source={getImageSource(workout.protocolImg)} style={styles.optionImage} />
            <Text style={styles.optionText}>{workout.protocolName}</Text>
          </TouchableOpacity>
        ))}
      </View>
      </View>
      <View style = {styles.levelsMainContainer}>
      {selectedOption && (
        <>
          <Text style={styles.subheading}>Choose difficulty level</Text>
          <View style={styles.levelsContainer}>
            <TouchableOpacity style={styles.levelButton} onPress={() => handleLevelPress('Easy')}>
              <Text style={styles.levelText}>Beginner</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.levelButton} onPress={() => handleLevelPress('Medium')}>
              <Text style={styles.levelText}>Intermediate</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.levelButton} onPress={() => handleLevelPress('Hard')}>
              <Text style={styles.levelText}>Expert</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    top:100,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    
  },
  levelsMainContainer:
  {
    top:200,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    alignSelf:'center',
    fontSize: 24,
    marginBottom: 20,
  },
  subheading: {
    alignSelf:'center',
    fontSize: 30,
    marginBottom: 10,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap:'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionButton: {
    alignItems: 'center',
    width: 180,
    height: 180,
    borderRadius: 10,
    overflow: 'hidden',
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
  levelsContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginTop: 20,
    
  },
  levelButton: {
    paddingHorizontal:80,
    paddingVertical:20,
    width:"100%",
    backgroundColor: '#43A1A4',
    borderRadius: 30,
    margin:10,
  },
  levelText: {
    textAlign: 'center',
    width:150,
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  hideOptions: {
    display: 'none',
  },
});

export default WorkoutScreen;
