// src/screens/DateOfBirthScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { API_URL } from '@env';
import axios from 'axios';
import { useSelector,useDispatch } from 'react-redux';

const DateOfBirthScreen = ({ navigation }) => {
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const userId = useSelector((state) => state.user.userId);
  const handleUpdate = async () => {
    const dateOfBirth = `${year}-${month}-${day}`; // You can format the date as needed
    console.log(dateOfBirth);
    try {
      console.log(`http://${API_URL}/users/update-demographics`);
      const response = await axios.put(`http://${API_URL}/users/update-demographics`, {
        userId: userId,
        dateOfBirth: dateOfBirth
      });
      console.log(response.data);
      if (response.data) {
        navigation.navigate('AgeGroup');
      }
    } catch (err) {
      console.log(err);
      Alert.alert('There was an error. Please try again', err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Date of Birth</Text>
      <View style={styles.fields}>
        <TextInput
          style={styles.input}
          placeholder="DD"
          value={day}
          onChangeText={setDay}
          keyboardType="numeric"
          maxLength={2}
        />
        <TextInput
          style={styles.input}
          placeholder="MM"
          value={month}
          onChangeText={setMonth}
          keyboardType="numeric"
          maxLength={2}
        />
        <TextInput
          style={styles.yearInput}
          placeholder="YYYY"
          value={year}
          onChangeText={setYear}
          keyboardType="numeric"
          maxLength={4}
        />
      </View>
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
  fields: {
    flexDirection: 'row',
  },
  input: {
    margin:10,
    padding: 15,
    width: 70,
    backgroundColor: "#E7E7E7",
    borderRadius: 10,
    marginBottom: 20,
  },
  yearInput: {
    margin:10,
    padding: 15,
    width: 120,
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

export default DateOfBirthScreen;
