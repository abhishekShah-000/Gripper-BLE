// src/screens/GenderScreen.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector,useDispatch } from 'react-redux';
import { API_URL } from '@env';
import axios from 'axios';

const GaolsScreen = ({ navigation }) => {
  const [goals, setGoals] = useState('');
  const userId = useSelector((state) => state.user.userId);
  const handleUpdate = async () => {
    try {
      console.log(`http://${API_URL}/users/update-demographics`);
      const response = await axios.put(`http://${API_URL}/users/update-demographics`, {
        userId,
        goals
      });
      console.log(response.data);
      if (response.data) {
        navigation.navigate("HeartCondition");
      }
    } catch (err) {
      console.log(err);
      Alert.alert('There was an error. Please try again', err);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.label}>What are your goals with this grip trainer?</Text>
      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.button, goals === 'Lower Blood Pressure' && styles.selectedButton]}
          onPress={() => setGoals('Lower Blood Pressure')}
        >
          <Text style={[styles.buttonText, goals === 'Lower Blood Pressure' && styles.selectedButtonText]}>Lower Blood Pressure</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, goals === 'Increase Grip Strength' && styles.selectedButton]}
          onPress={() => setGoals('Increase Grip Strength')}
        >
          <Text style={[styles.buttonText, goals === 'Increase Grip Strength' && styles.selectedButtonText]}>Increase Grip Strength</Text>
        </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.button, goals === 'Injury Prevention/Rehabilitation' && styles.selectedButton]}
        onPress={() => setGoals('Injury Prevention/Rehabilitation')}
      >
        <Text style={[styles.buttonText, goals === 'Injury Prevention/Rehabilitation' && styles.selectedButtonText]}>Injury Prevention/Rehabilitation</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, goals === 'General Fitness' && styles.selectedButton]}
        onPress={() => setGoals('General Fitness')}
      >
        <Text style={[styles.buttonText, goals === 'General Fitness' && styles.selectedButtonText]}>General Fitness</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, goals === 'For fun' && styles.selectedButton]}
        onPress={() => setGoals('For fun')}
      >
        <Text style={[styles.buttonText, goals === 'For fun' && styles.selectedButtonText]}>For fun</Text>
      </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.nextButton}
        onPress={handleUpdate}
      >
        <Text style={styles.nextButtonText}>→</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 20,
    color: "gray",
    paddingBottom: 20,
    marginBottom: 10,
  },
  buttons: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginBottom: 10,
  },
  preferNotStyle:
  {
    flex:1,
    //paddingLeft:20,
    width:600,
  },
  button: {
    padding: 20,
    margin:10,
    backgroundColor: "#E7E7E7",
    borderRadius: 5,
    width: '50%',
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#00bfa5',
  },
  buttonText: {
    color: 'gray',
    fontSize:16,
  },
  selectedButtonText: {
    color: 'white',
  },
  nextButton: {
    position: 'absolute',
    width: 100,
    height: 50,
    right: 20,
    bottom: 20,
    backgroundColor: '#00bfa5',
    borderRadius: 50,
    paddingVertical: 1,
    paddingHorizontal: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: {
    position: 'absolute',
    top: -25,
    fontSize: 55,
    color: 'white',
  },
});

export default GaolsScreen;
