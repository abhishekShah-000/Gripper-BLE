// src/screens/WeightHeightScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector,useDispatch } from 'react-redux';
import { API_URL } from '@env';
import axios  from 'axios';
const WeightHeightScreen = ({ navigation }) => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const userId = useSelector((state) => state.user.userId);
  const handleUpdate = async () => {
    
    try {
      console.log(`http://${API_URL}/users/update-demographics`);
      const response = await axios.put(`http://${API_URL}/users/update-demographics`, {
        userId,
        weight,
        height
      });
      console.log(response.data);
      if (response.data) {
        navigation.navigate('FitnessLevel');
      }
    } catch (err) {
      console.log(err);
      Alert.alert('There was an error. Please try again', err);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Weight</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your weight"
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
      />
      <Text style={styles.label}>Height</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your height"
        value={height}
        onChangeText={setHeight}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.nextButton} onPress={handleUpdate}>
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
    marginBottom: 10,
    color: "gray",
    paddingBottom: 20,
  },
  input: {
    padding: 15,
    width:150,
    
    backgroundColor: "#E7E7E7",
    borderRadius: 10,
    marginBottom: 20,
  },
  nextButton: {
    position: 'absolute',
    width: 100, // Increase the width of the button
    height: 50, // Keep the height of the button
    right: 20,
    bottom: 20,
    backgroundColor: '#00bfa5',
    borderRadius: 50,
    paddingVertical: 1, // Adjust vertical padding
    paddingHorizontal: 0, // Adjust horizontal padding
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

export default WeightHeightScreen;
