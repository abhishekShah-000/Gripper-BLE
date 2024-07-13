// screens/WelcomeScreen.js
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const LandingScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require('../assets/welcomeScreen.png')} // Ensure this path is correct
          style={styles.image}
        />
        <View style={styles.overlay}>
          <Text style={styles.title}>Welcome to Gripper</Text>
          <Text style={styles.subtitle}>Dorem ipsum dolor sit amet, consectetur adipiscing elit.</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonText}>Let's Begin</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    flex: 8,
    width: screenWidth,
    height: screenWidth * 1.25, // Adjust the height as needed
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  image: {
    top:-100,
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  overlay: {
    position: 'absolute',
    bottom: 70, // Adjust based on your design
    left: 20,
    right: 20,
    alignItems: 'stretch',
  },
  title: {
    fontSize: 45,
    fontWeight: 'bold',
    color: '#3D3D3D', // Match the color in the image
  },
  subtitle: {
    fontSize: 16,
    
    color: '#3D3D3D', // Match the color in the image
    marginTop: 10,
  },
  button: {
    backgroundColor: '#00C7B1',
    paddingVertical: 15,
    width: screenWidth*.85,
    paddingHorizontal: 30,
    borderRadius: 30, // Rounded corners
    marginVertical: 20,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  buttonIcon: {
    width: 20,
    height: 20,
    tintColor: '#fff',
  },
});

export default LandingScreen;
