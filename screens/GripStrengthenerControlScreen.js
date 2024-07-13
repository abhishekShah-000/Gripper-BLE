import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import useBLE from '../useBLE'; // Assuming this is your custom hook for BLE operations

const GripStrengthenerControlScreen = () => {
  const { requestPermissions, scanForPeripherals, connectToDevice, disconnectFromDevice, writeToDevice, readFromDevice } = useBLE();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');

  useEffect(() => {
    initBLE();
  }, []);

  const initBLE = async () => {
    setLoading(true);
    try {
      const permissionsGranted = await requestPermissions();
      if (permissionsGranted) {
        scanForPeripherals();
      } else {
        Alert.alert('Permissions required', 'Please grant Bluetooth permissions to use this feature.');
      }
    } catch (error) {
      console.error('Error initializing BLE:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendCommand = async (command) => {
    try {
      await writeToDevice(command);
      console.log(`Sent command: ${command}`);

      // Wait for response from device
      const receivedResponse = await waitForResponse();
      setResponse(receivedResponse);
      console.log('Received response:', receivedResponse);
      
      // Handle the response as needed
      Alert.alert('Command Sent', 'Command successfully sent and processed.');
    } catch (error) {
      console.error('Error sending command:', error);
      Alert.alert('Error', 'Failed to send command. Please try again.');
    }
  };

  const waitForResponse = async () => {
    try {
      const response = await readFromDevice(); // Example function to read from device
      console.log(response);
      return response;
    } catch (error) {
      console.error('Error reading response:', error);
      throw error; // Handle or propagate the error as needed
    }
  };

  const handleSetSleepTimeout = () => {
    sendCommand('T:05,10,120,020,10,XX'); // Example: Set Sleep Timeout to 100 seconds
  };

  const handleSetTimeToConnect = () => {
    sendCommand('TC:30'); // Example: Set Time to Connect to 30 seconds
  };

  // Add more handlers for other commands as needed

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      <TouchableOpacity onPress={handleSetSleepTimeout}>
        <Text>Set Sleep Timeout to 100 seconds</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSetTimeToConnect}>
        <Text>Set Time to Connect to 30 seconds</Text>
      </TouchableOpacity>
      {/* Display response from device */}
      <Text>Response from device: {response}</Text>
    </View>
  );
};

export default GripStrengthenerControlScreen;
