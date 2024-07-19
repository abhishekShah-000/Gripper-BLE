import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, FlatList, Image } from 'react-native';
import axios from 'axios';
import { useIsFocused } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation, useRoute } from "@react-navigation/native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector,useDispatch } from 'react-redux';
import { API_URL } from '@env';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const WorkoutHistoryScreen = () => {
  const insets = useSafeAreaInsets();
  const token = useSelector((state) => state.user.token);
  const userId = useSelector((state) => state.user.userId);
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [protocolCounts, setProtocolCounts] = useState({});
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  //const API_URL = "192.168.2.108:5000/";
  console.log(token);
  useEffect(() => {
    if (isFocused) {
      fetchWorkoutHistory();
    }
  }, [isFocused]);

  const fetchWorkoutHistory = async () => {
    try {
      console.log(`http://${API_URL}/users/${userId}/workoutHistory`);
      const response = await axios.get(`http://${API_URL}/users/${userId}/workoutHistory`,{
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
      
      );
      setWorkoutHistory(response.data.filteredWorkoutHistory);
      setProtocolCounts(response.data.protocolCounts);
    } catch (error) {
      console.error('Error fetching workout summary:', error);
      Alert.alert('Error', 'Failed to fetch workout summary.');
    }
  };

  const renderProtocolCount = () => (
    <View style={styles.protocolCountsContainer}>
      {Object.keys(protocolCounts).map(protocol => (
        <TouchableOpacity 
          key={protocol}
          onPress={() => navigation.navigate("ProtocolDetail", { userId, protocol })}
        >
          <View style={styles.protocolCountItem}>
            <Image
              style={styles.protocolImage}
              source={require("../assets/AHAP.png")}
            />
            <Text style={styles.protocolCountText}>{protocol}: {protocolCounts[protocol]}</Text>
            <Ionicons name="arrow-forward" size={32} color="black" />
          </View>   
        </TouchableOpacity>  
      ))}
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
    <ScrollView style={styles.container}>
      <View style={styles.historyContainer}>
        <Text style={styles.historyTitle}>Workout History</Text>
        {renderProtocolCount()}
      </View>
    </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  historyContainer: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 16,
    alignSelf: 'center',
  },
  protocolCountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "white",
    margin: 16,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 10, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  protocolImage: {
    borderRadius: 20,
    width: 60,
    height: 60,
    marginRight: 16,
  },
  protocolCountText: {
    fontSize: 18,
    flex: 1,
  },
});

export default WorkoutHistoryScreen;
