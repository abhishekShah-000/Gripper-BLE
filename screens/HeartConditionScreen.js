// src/screens/HeartConditionScreen.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Button } from 'react-native';
import axios  from 'axios';
//import { sendUserData } from '../services/api';
//import { API_URL } from '@env';
const HeartConditionScreen = ({ navigation, route }) => {
  const API_URL = "192.168.2.102:5000/";
  const { userId,username, password, name, gender, dateOfBirth, weight, height, fitnessLevel } = route.params;
  console.log("id",userId);
  const [heartCondition, setHeartCondition] = useState('');

  const handleSubmit = async () => {
    const data = {  userId, username, password,name, gender, dateOfBirth, weight, height, fitnessLevel, heartCondition };
    try {
      const response = await axios.post(`http://${API_URL}users/register`, {
        data
      });
      console.log('User data submitted successfully:', response);
      navigation.navigate('Welcome',{userId}); // Navigate to the next screen or confirmation page
    } catch (error) {
      console.error('Error submitting user data:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Do you have any existing heart conditions?</Text>
      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.button, heartCondition === 'Yes' && styles.selectedButton]}
          onPress={() => setHeartCondition('Yes')}
        >
          <Text style={[styles.buttonText, heartCondition === 'Yes' && styles.selectedButtonText]}>Yes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, heartCondition === 'No' && styles.selectedButton]}
          onPress={() => setHeartCondition('Sometimes')}
        >
          <Text style={[styles.buttonText, heartCondition === 'No' && styles.selectedButtonText]}>No</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.nextButton}
        onPress={() =>handleSubmit()}
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
    gap:30,
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
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: "gainsboro",
    borderRadius: 10,
    width: '25%',
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

export default HeartConditionScreen;
