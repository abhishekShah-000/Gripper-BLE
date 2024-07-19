import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { Dimensions } from 'react-native';
import GraphComponent from '../components/GraphComponent';
import { API_URL } from '@env';
import { useSelector,useDispatch } from 'react-redux';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const screenWidth = Dimensions.get('window').width;

const ProtocolDetailScreen = () => {
  const insets = useSafeAreaInsets();
  const token = useSelector((state) => state.user.token);
  const userId = useSelector((state) => state.user.userId);
  const route = useRoute();
  const { protocol } = route.params;
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [selectedHand, setSelectedHand] = useState({}); // State to keep track of selected hand for each workout
  const isFocused = useIsFocused();
  //const API_URL = "192.168.2.108:5000/";

  useEffect(() => {
    if (isFocused) {
      fetchWorkoutHistory();
    }
  }, [isFocused]);

  const fetchWorkoutHistory = async () => {
    try {
      const response = await axios.get(`http://${API_URL}/users/${userId}/workouts/${protocol}`,
      {
        headers:
        {
          'Authorization': `Bearer ${token}`
        }
      });
      setWorkoutHistory(response.data);
    } catch (error) {
      console.error('Error fetching workout summary:', error);
      Alert.alert('Error', 'Failed to fetch workout summary.');
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Beginner':
        return 'green';
      case 'Intermediate':
        return 'orange';
      case 'Hard':
        return 'red';
      default:
        return 'gray';
    }
  };

  const handleSelectHand = (workoutId, hand) => {
    setSelectedHand((prevSelectedHand) => ({
      ...prevSelectedHand,
      [workoutId]: hand,
    }));
  };

  const renderWorkoutSummary = ({ item: workout }) => {
    const hand = selectedHand[workout._id.$oid] || 'left';
    const data = hand === 'left' ? workout.leftHandData : workout.rightHandData;
    const percentages = hand === 'left' ? workout.leftHandPercentages : workout.rightHandPercentages;

    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
      <View key={workout._id.$oid} style={styles.workoutItemContainer}>
        <View style={styles.protocolContainer}>
          <Text style={styles.workoutText}>{workout.protocol}</Text>
          <View style={[styles.levelContainer, { borderColor: getLevelColor(workout.level) }]}>
            <Text style={[styles.levelText, { color: getLevelColor(workout.level) }]}>{workout.level}</Text>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, hand === 'left' && styles.selectedButton]}
            onPress={() => handleSelectHand(workout._id.$oid, 'left')}
          >
            <Text style={styles.buttonText}>Left Hand</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, hand === 'right' && styles.selectedButton]}
            onPress={() => handleSelectHand(workout._id.$oid, 'right')}
          >
            <Text style={styles.buttonText}>Right Hand</Text>
          </TouchableOpacity>
        </View>
        <GraphComponent 
          width={screenWidth - 100}
          height={220}
          datasets={[data]}
          labels={data.map((_, index) => (index + 1).toString())}
        />
        <View style={styles.percentages}>
          <Text style={styles.workoutText}>Duration: {workout.duration} seconds</Text>
          <Text style={styles.date}>Date: {new Date(workout.date).toLocaleDateString()}</Text>
        </View>
        <View style={styles.percentages}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.percentage}>Above: </Text>
            <Text style={[styles.percentageAmt, { color: getLevelColor('Intermediate') }]}>{percentages.aboveThreshold}%</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.percentage}>On: </Text>
            <Text style={[styles.percentageAmt, { color: getLevelColor('Beginner') }]}>{percentages.onThreshold}%</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.percentage}>Below: </Text>
            <Text style={[styles.percentageAmt, { color: getLevelColor('Hard') }]}>{percentages.belowThreshold}%</Text>
          </View>
        </View>
      </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.historyContainer}>
        <Text style={styles.historyTitle}>{protocol} History</Text>
        <FlatList
          data={workoutHistory}
          renderItem={renderWorkoutSummary}
          keyExtractor={(item) => item._id.$oid}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  workoutText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  historyContainer: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 24,
    margin: 16,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
  },
  workoutItemContainer: {
    backgroundColor: 'white',
    margin: 16,
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  protocolContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  levelContainer: {
    marginLeft: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  levelText: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 5,
  },
  selectedButton: {
    backgroundColor: '#007BFF',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  percentages: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  percentageAmt: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  percentage: {
    fontSize: 16,
    color: '#333',
  },
});

export default ProtocolDetailScreen;
