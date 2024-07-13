// src/screens/DateOfBirthScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

const DateOfBirthScreen = ({ navigation, route }) => {
  const { userId, username, password, name, gender } = route.params;
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  const handleNext = () => {
    const dateOfBirth = `${day}-${month}-${year}`; // You can format the date as needed
    navigation.navigate('WeightHeight', { userId, username, password,name, gender, dateOfBirth });
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
      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
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
    gap: 30,
  },
  input: {
    padding: 15,
    borderWidth: 1,
    width: 70,
    borderColor: '#ccc',
    backgroundColor: "gainsboro",
    borderRadius: 10,
    marginBottom: 20,
  },
  yearInput: {
    padding: 15,
    borderWidth: 1,
    width: 120,
    borderColor: '#ccc',
    backgroundColor: "gainsboro",
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
