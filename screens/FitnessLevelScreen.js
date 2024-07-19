// src/screens/GenderScreen.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector,useDispatch } from 'react-redux';
import { API_URL } from '@env';
import axios  from 'axios';

const FitnessLevelScreen = ({ navigation}) => {
  const [fitnessLevel, setFitnessLevel] = useState('');
  const userId = useSelector((state) => state.user.userId);
  const handleUpdate = async () => {
    
    try {
      console.log(`http://${API_URL}/users/update-demographics`);
      const response = await axios.put(`http://${API_URL}/users/update-demographics`, {
        userId,
        fitnessLevel,
      });
      console.log(response.data);
      if (response.data) {
        navigation.navigate('Goals')
      }
    } catch (err) {
      console.log(err);
      Alert.alert('There was an error. Please try again', err);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Current fitness level</Text>
      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.button, fitnessLevel === 'Very Active' && styles.selectedButton]}
          onPress={() => setFitnessLevel('Very Active')}
        >
          <Text style={[styles.buttonText, fitnessLevel === 'Very Active' && styles.selectedButtonText]}>Very Active</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, fitnessLevel === 'Sometimes' && styles.selectedButton]}
          onPress={() => setFitnessLevel('Sometimes')}
        >
          <Text style={[styles.buttonText, fitnessLevel === 'Sometimes' && styles.selectedButtonText]}>Sometimes</Text>
        </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, fitnessLevel === 'Never' && styles.selectedButton]}
        onPress={() => setFitnessLevel('Never')}
      >
        <Text style={[styles.buttonText, fitnessLevel === 'Never' && styles.selectedButtonText]}>Never</Text>
      </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => handleUpdate()}
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
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: "gainsboro",
    borderRadius: 10,
    width: '40%',
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

export default FitnessLevelScreen;
