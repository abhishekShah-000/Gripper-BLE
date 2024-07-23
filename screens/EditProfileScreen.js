import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { API_URL } from '@env';
import axios from 'axios';
import { useSelector } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';

const OptionSelector = ({ label, options, selectedValue, onSelect, multiSelect = false }) => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.optionsContainer}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.option,
              multiSelect
                ? selectedValue.includes(option) && styles.selectedOption
                : selectedValue === option && styles.selectedOption,
              index % 2 === 0 ? styles.leftColumn : styles.rightColumn
            ]}
            onPress={() => onSelect(option)}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const EditProfileScreen = ({ navigation }) => {
  const userId = useSelector((state) => state.user.userId);
  const token = useSelector((state) => state.user.token);
  const [profile, setProfile] = useState({
    username: '',
    name: '',
    gender: '',
    dateOfBirth: new Date(),
    weight: '',
    height: '',
    fitnessLevel: '',
    heartCondition: '',
    ageRange: '',
    goals: []
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  const genderOptions = ['Male', 'Female'];
  const fitnessLevelOptions = ['Very Active', 'Sometimes', 'Never'];
  const heartConditionOptions = ['Yes', 'No'];
  const ageRangeOptions = ['0-18', '18-32', '32-50', '50-68', '68+'];
  const goalOptions = [
    'Lower Blood Pressure',
    'Increase Grip Strength',
    'Injury Prevention/Rehabilitation',
    'General Fitness',
    'For fun'
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`http://${API_URL}/users/user-profile/${userId}`,
        {
            headers:
            {
                 'Authorization': `Bearer ${token}`
            }
        }
      );
      console.log(response.data);
      setProfile({
        ...response.data,
        dateOfBirth: new Date(response.data.dateOfBirth),
        weight: response.data.weight.toString(),
        height: response.data.height.toString(),
        goals: response.data.goals || []
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

  const toggleOption = (field, value) => {
    if (field === 'goals') {
      const updatedGoals = profile.goals.includes(value)
        ? profile.goals.filter(g => g !== value)
        : [...profile.goals, value];
      handleChange('goals', updatedGoals);
    } else {
      handleChange(field, value);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Edit Profile</Text>
      
      <Text style={styles.label}>Username</Text>
      <TextInput
        style={styles.input}
        value={profile.username}
        onChangeText={(text) => handleChange('username', text)}
      />

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={profile.name}
        onChangeText={(text) => handleChange('name', text)}
      />

      <Text style={styles.label}>Date of Birth</Text>
      <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
        <Text>{profile.dateOfBirth.toDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={profile.dateOfBirth}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}

      <Text style={styles.label}>Weight (kg)</Text>
      <TextInput
        style={styles.input}
        value={profile.weight}
        onChangeText={(text) => handleChange('weight', text)}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Height (cm)</Text>
      <TextInput
        style={styles.input}
        value={profile.height}
        onChangeText={(text) => handleChange('height', text)}
        keyboardType="numeric"
      />

      <OptionSelector
        label="Gender"
        options={genderOptions}
        selectedValue={profile.gender}
        onSelect={(value) => toggleOption('gender', value)}
      />

      <OptionSelector
        label="Age Range"
        options={ageRangeOptions}
        selectedValue={profile.ageRange}
        onSelect={(value) => toggleOption('ageRange', value)}
      />

      <OptionSelector
        label="Fitness Level"
        options={fitnessLevelOptions}
        selectedValue={profile.fitnessLevel}
        onSelect={(value) => toggleOption('fitnessLevel', value)}
      />

      <OptionSelector
        label="Heart Condition"
        options={heartConditionOptions}
        selectedValue={profile.heartCondition}
        onSelect={(value) => toggleOption('heartCondition', value)}
      />

      <OptionSelector
        label="Goals"
        options={goalOptions}
        selectedValue={profile.goals}
        onSelect={(value) => toggleOption('goals', value)}
        multiSelect={true}
      />

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
    marginBottom: 60,
  },
  updateButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionContainer: {
    marginBottom: 20,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  option: {
    width: '48%',
    padding: 15,
    marginVertical: 5,
    backgroundColor: "#E7E7E7",
    borderRadius: 10,
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: "#00bfa5",
  },
  optionText: {
    textAlign: 'center',
    color: 'black',
  },
  leftColumn: {
    marginRight: '2%',
  },
  rightColumn: {
    marginLeft: '2%',
  },
});

export default EditProfileScreen;