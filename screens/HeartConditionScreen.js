// src/screens/HeartConditionScreen.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Button,Alert } from 'react-native';
import axios  from 'axios';
import { useSelector,useDispatch } from 'react-redux';
//import { sendUserData } from '../services/api';
import { API_URL } from '@env';
const HeartConditionScreen = ({ navigation }) => {
  const [heartCondition, setHeartCondition] = useState('');
  const userId = useSelector((state) => state.user.userId);
  const handleUpdate = async () => {
    
    try {
      console.log(`http://${API_URL}/users/update-demographics`);
      const response = await axios.put(`http://${API_URL}/users/update-demographics`, {
        userId,
        heartCondition,
      });
      console.log(response.data);
      if (response.data) {
        navigation.navigate('BottomTabs')
      }
    } catch (err) {
      console.log(err);
      Alert.alert('There was an error. Please try again', err);
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
          onPress={() => setHeartCondition('No')}
        >
          <Text style={[styles.buttonText, heartCondition === 'No' && styles.selectedButtonText]}>No</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.nextButton}
        onPress={() =>handleUpdate()}
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
