import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { API_URL } from '@env';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';

const EditProfileScreen = ({ navigation }) => {
  const userId = useSelector((state) => state.user.userId);
  const token = useSelector((state) => state.user.token);
  const [profile, setProfile] = useState({
    username: '',
    name: '',
    gender: '',
    dateOfBirth: new Date(),
    ageRange:'',
    weight: '',
    height: '',
    fitnessLevel: '',
    heartCondition: '',
    goals:'',

  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`http://${API_URL}/users/user-profile/${userId}`,
        {
            headers: {
                'Authorization': `Bearer ${token}`
              }
        }
      );
      setProfile({
        ...response.data,
        dateOfBirth: new Date(response.data.dateOfBirth),
        weight: response.data.weight.toString(),
        height: response.data.height.toString()
      });
    } catch (err) {
      console.log(err);
      Alert.alert('Error fetching profile', 'Please try again');
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(`http://${API_URL}/users/update-demographics`, {
        userId,
        ...profile,
        weight: Number(profile.weight),
        height: Number(profile.height)
      });
      if (response.data) {
        Alert.alert('Success', 'Profile updated successfully');
        navigation.goBack();
      }
    } catch (err) {
      console.log(err);
      Alert.alert('Update Error', 'There was an error. Please try again');
    }
  };

  const handleChange = (name, value) => {
    setProfile(prevProfile => ({
      ...prevProfile,
      [name]: value
    }));
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      handleChange('dateOfBirth', selectedDate);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Edit Profile</Text>
      
      {Object.entries(profile).map(([key, value]) => {
        if (key === 'userId') return null;
        if (key === 'dateOfBirth') {
          return (
            <View key={key}>
              <Text style={styles.label}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
              <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
                <Text>{value.toDateString()}</Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={value}
                  mode="date"
                  display="default"
                  onChange={onDateChange}
                />
              )}
            </View>
          );
        }
        return (
          <View key={key}>
            <Text style={styles.label}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={(text) => handleChange(key, text)}
            />
          </View>
        );
      })}

      <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
        <Text style={styles.updateButtonText}>Update Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "gray",
  },
  input: {
    padding: 15,
    backgroundColor: "#E7E7E7",
    borderRadius: 10,
    marginBottom: 20,
  },
  updateButton: {
    backgroundColor: '#00bfa5',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  updateButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EditProfileScreen;