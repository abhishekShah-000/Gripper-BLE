// src/screens/GenderScreen.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const GenderScreen = ({ navigation, route }) => {
  const {  userId,username, password,name } = route.params;
  const [gender, setGender] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Gender</Text>
      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.button, gender === 'Male' && styles.selectedButton]}
          onPress={() => setGender('Male')}
        >
          <Text style={[styles.buttonText, gender === 'Male' && styles.selectedButtonText]}>Male</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, gender === 'Female' && styles.selectedButton]}
          onPress={() => setGender('Female')}
        >
          <Text style={[styles.buttonText, gender === 'Female' && styles.selectedButtonText]}>Female</Text>
        </TouchableOpacity>
      </View>
      <View style = {styles.preferNotStyle}>
      <TouchableOpacity
        style={[styles.button, gender === 'Prefer not to say' && styles.selectedButton]}
        onPress={() => setGender('Prefer not to say')}
      >
        <Text style={[styles.buttonText, gender === 'Prefer not to say' && styles.selectedButtonText]}>Prefer not to say</Text>
      </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => navigation.navigate('DateOfBirth', { userId, username, password, name, gender })}
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
    flexDirection: 'row',
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
    borderRadius: 5,
    width: '30%',
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

export default GenderScreen;
