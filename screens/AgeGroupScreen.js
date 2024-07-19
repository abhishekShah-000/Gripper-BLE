// src/screens/GenderScreen.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector,useDispatch } from 'react-redux';
import { API_URL } from '@env';
import axios from 'axios';

const AgeGroupScreen = ({ navigation }) => {
  const [ageRange, setRange] = useState('');
  const userId = useSelector((state) => state.user.userId);
  const handleUpdate = async () => {
    try {
      console.log(`http://${API_URL}/users/update-demographics`);
      const response = await axios.put(`http://${API_URL}/users/update-demographics`, {
        userId,
        ageRange
      });
      console.log(response.data);
      if (response.data) {
        navigation.navigate("WeightHeight");
      }
    } catch (err) {
      console.log(err);
      Alert.alert('There was an error. Please try again', err);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Age Group</Text>
      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.button, ageRange === '0-18' && styles.selectedButton]}
          onPress={() => setRange('0-18')}
        >
          <Text style={[styles.buttonText, ageRange === '0-18' && styles.selectedButtonText]}>0-18</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, ageRange === '18-32' && styles.selectedButton]}
          onPress={() => setRange('18-32')}
        >
          <Text style={[styles.buttonText, ageRange === '18-32' && styles.selectedButtonText]}>18-32</Text>
        </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.button, ageRange === '32-50' && styles.selectedButton]}
        onPress={() => setRange('32-50')}
      >
        <Text style={[styles.buttonText, ageRange === '32-50' && styles.selectedButtonText]}>32-50</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, ageRange === '50-68' && styles.selectedButton]}
        onPress={() => setRange('50-68')}
      >
        <Text style={[styles.buttonText, ageRange === '50-68' && styles.selectedButtonText]}>50-68</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, ageRange === '68+' && styles.selectedButton]}
        onPress={() => setRange('68+')}
      >
        <Text style={[styles.buttonText, ageRange === '68+' && styles.selectedButtonText]}>68+</Text>
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

export default AgeGroupScreen;
