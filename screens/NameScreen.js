// src/screens/NameScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

const NameScreen = ({ navigation, route }) => {
  const [name, setName] = useState('');
  const {  userId, username, password } = route.params;
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name here"
        value={name}
        onChangeText={setName}
      />
      <TouchableOpacity style={styles.nextButton} onPress={() => navigation.navigate('Gender', {userId,username, password,name })}>
        <Text style={styles.nextButtonText}>→</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:100,
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 20,
    marginBottom: 10,
    color:"gray",
    paddingBottom:20,
  },
  input: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor:"gainsboro",
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
    position:'absolute',
    top:-25,
    fontSize:55,
    color: 'white',
  },
});

export default NameScreen;
