import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image, TouchableOpacity, Dimensions } from 'react-native';
import axios from 'axios';
import uuid from 'react-native-uuid';  
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');


const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const userId = uuid.v4();

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require('../assets/loginScreenBg.png')} // Ensure this path is correct
          style={styles.image}
        />
      </View>
      <View style={styles.overlay}>
        <Text style={styles.title}>Create an account</Text>
        <Text style={styles.subtitle}>Enter your email to sign up for this app</Text>
        <TextInput
          style={styles.input}
          placeholder="email@domain.com or username"
          placeholderTextColor="#888"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#888"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <Text style={styles.registerText}>
          Already have an account?{' '}
          <Text style={styles.linkText} onPress={() => navigation.navigate('Login')}>
            Login
          </Text>
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={()=>navigation.navigate('Name',{username, password,userId})}
        >
          <Text style={styles.buttonText}>Sign up with email</Text>
        </TouchableOpacity>
        <Text style={styles.orText}>or continue with</Text>
        <TouchableOpacity style={styles.googleButton}>
          <Image
            source={{ uri: 'https://img.icons8.com/color/48/000000/google-logo.png' }}
            style={styles.googleIcon}
          />
          <Text style={styles.googleButtonText}>Google</Text>
        </TouchableOpacity>
        <Text style={styles.termsText}>
          By clicking continue, you agree to our{' '}
          <Text style={styles.linkText}>Terms of Service</Text> and{' '}
          <Text style={styles.linkText}>Privacy Policy</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    width: screenWidth,
    height: screenHeight * 0.75,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  overlay: {
    paddingHorizontal: 30,
    alignItems: 'center',
    marginTop: -screenHeight * 0.45,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3D3D3D',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#3D3D3D',
    marginTop: 10,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#000',
  },
  button: {
    backgroundColor: '#00C7B1',
    width: '100%',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orText: {
    fontSize: 14,
    color: '#888',
    marginVertical: 20,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  googleButtonText: {
    fontSize: 16,
    color: '#000',
  },
  termsText: {
    fontSize: 12,
    color: '#888',
    marginTop: 20,
    textAlign: 'center',
  },
  linkText: {
    color: '#00C7B1',
    textDecorationLine: 'underline',
  },
  registerText: {
    fontSize: 14,
    color: '#888',
    marginTop: 20,
    textAlign: 'center',
  },
});

export default RegisterScreen;
