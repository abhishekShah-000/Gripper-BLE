import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import DateRangePickerComponent from "../components/DateRangePickerComponent";
import GraphComponent from "../components/GraphComponent";
import BarChartComponent from '../components/BarChartComponent';
import { Dimensions } from 'react-native';

const WorkoutReportScreen = ({userId}) => { 
  
  console.log("report:",userId);
  const screenWidth = Dimensions.get('window').width;

  const [totalWorkouts, setTotalWorkouts] = useState(0);
  const [maxStrength, setMaxStrength] = useState(0);
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [strengthData, setStrengthData] = useState([]);
  const [filteredStrengthData, setFilteredStrengthData] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [aggregatedData, setAggregatedData] = useState([]);

  const route = useRoute();
  const API_URL = "192.168.2.108:5000/";

  useEffect(() => {
    fetchWorkoutSummary();
    fetchMaxStrength();
    fetchWorkoutHistory();
    setInitialDateRange();
  }, []);

  useEffect(() => {
    if(aggregatedData.labels){
      if (aggregatedData.labels.length > 0) {
        console.log("Aggregated Data:", aggregatedData.datasets, aggregatedData.labels);
        // Perform any action you need with the updated aggregated data here
      }
    }
  }, [aggregatedData]);

  useEffect(() => {
    filterStrengthData();
  }, [startDate, endDate, strengthData]);

  const setInitialDateRange = () => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 (Sun) - 6 (Sat)
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - dayOfWeek + 1); // Adjust to Monday
    const endOfWeek = new Date(now);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Adjust to Sunday

    setStartDate(startOfWeek);
    setEndDate(endOfWeek);
    aggregateData(workoutHistory, startOfWeek, endOfWeek);
  };

  const fetchWorkoutSummary = async () => {
    try {
      const response = await axios.get(`http://${API_URL}users/${userId}/workoutSummary`);
      setTotalWorkouts(response.data.totalWorkouts);
    } catch (error) {
      console.error('Error fetching workout summary:', error);
      Alert.alert('Error', 'Failed to fetch workout summary.');
    }
  };

  const fetchWorkoutHistory = async () => {
    console.log("hello");
    try {
      console.log(`http://${API_URL}users/${userId}/workoutHistory`);
      const response = await axios.get(`http://${API_URL}users/${userId}/workoutHistory`);
      console.log("response:",response.data);
      setWorkoutHistory(response.data.filteredWorkoutHistory);
    } catch (error) {
      console.error('Error fetching workout summary:', error);
      Alert.alert('Error', 'Failed to fetch workout summary.');
    }
  };

  const fetchMaxStrength = async () => {
    try {
      const response = await axios.get(`http://${API_URL}users/maxStrength/${userId}`);
      const maxStrengthData = response.data;
      // Calculate the total max strength value
      const strengthValues = maxStrengthData.map(data => data.strength);
      const maxStrengthValue = Math.max(...strengthValues);
      setMaxStrength(maxStrengthValue);

      setStrengthData(maxStrengthData);
    } catch (error) {
      console.error('Error fetching max strength:', error);
      Alert.alert('Error', 'Failed to fetch max strength.');
    }
  };

  const filterStrengthData = () => {
    if (startDate && endDate) {
      const filteredData = strengthData.filter(data => {
        const dataDate = new Date(data.time);
        console.log("max str time:",dataDate,",",startDate,",",endDate)
        return dataDate >= new Date(startDate) && dataDate <= new Date(endDate);
      });
  
      const labels = generateLabels(startDate, endDate);
      setFilteredStrengthData({
        data: filteredData.map(data => data.strength),
        labels: labels
      });
    } else {
      const labels = generateLabels(new Date(), new Date());
      setFilteredStrengthData({
        data: strengthData.map(data => data.strength),
        labels: labels
      });
    }
  };
  
  const handleDateConfirm = (start, end) => {
    console.log(start, end);
    setStartDate(start);
    setEndDate(end);
    aggregateData(workoutHistory, start, end);
    fetchWorkoutHistory();
  };

  const aggregateData = (data, startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
  
    const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    let labels = [];
    let aggr = [];
  
    if (diffDays <= 7) {
      // Aggregate by day
      labels = Array.from({ length: diffDays + 1 }, (_, i) => {
        const date = new Date(start);
        date.setUTCDate(start.getUTCDate() + i);
        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        return `${day}-${month}`;
      });
      aggr = labels.map(label => {
        const [day, month] = label.split('-').map(Number);
        const labelDate = new Date(Date.UTC(start.getUTCFullYear(), month - 1, day));
        const filteredData = data.filter(workout => {
          const workoutDate = new Date(workout.date);
          return (
            workoutDate.getUTCFullYear() === labelDate.getUTCFullYear() &&
            workoutDate.getUTCMonth() === labelDate.getUTCMonth() &&
            workoutDate.getUTCDate() === labelDate.getUTCDate()
          );
        });
        return filteredData.length; // Return count of workouts for the current label
      });
    } else if (diffDays <= 28) {
      // Aggregate by week
      labels = Array.from({ length: Math.ceil(diffDays / 7) }, (_, i) => {
        const date = new Date(start);
        date.setUTCDate(start.getUTCDate() + i * 7);
        return `Week ${i + 1}`;
      });
      aggr = labels.map((_, i) => {
        const weekStart = new Date(start);
        weekStart.setUTCDate(start.getUTCDate() + i * 7);
        let weekEnd = new Date(weekStart);
        weekEnd.setUTCDate(weekStart.getUTCDate() + 6);
        if (weekEnd > end) {
          weekEnd = end;
        }
        const filteredData = data.filter(workout => {
          const workoutDate = new Date(workout.date);
          return workoutDate >= weekStart && workoutDate <= weekEnd;
        });
        return filteredData.length; // Return count of workouts for the current week
      });
    } else if (diffDays <= 365) {
      // Aggregate by month
      const startMonth = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), 1));
      const endMonth = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth() + 1, 0));
      labels = [];
      let date = new Date(startMonth);
      while (date <= endMonth) {
        labels.push(`${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`);
        date.setUTCMonth(date.getUTCMonth() + 1);
      }
      aggr = labels.map(label => {
        const [year, month] = label.split('-').map(Number);
        const filteredData = data.filter(workout => {
          const workoutDate = new Date(workout.date);
          return (
            workoutDate.getUTCFullYear() === year &&
            workoutDate.getUTCMonth() === month - 1
          );
        });
        return filteredData.length; // Return count of workouts for the current month
      });
    } else {
      // Aggregate by year
      const startYear = start.getUTCFullYear();
      const endYear = end.getUTCFullYear();
      labels = Array.from({ length: endYear - startYear + 1 }, (_, i) => String(startYear + i));
      aggr = labels.map(label => {
        const year = Number(label);
        const filteredData = data.filter(workout => {
          const workoutDate = new Date(workout.date);
          return workoutDate.getUTCFullYear() === year;
        });
        return filteredData.length; // Return count of workouts for the current year
      });
    }
  
    setAggregatedData({ labels, datasets: [{ data: aggr }] });
    console.log("Aggregated Data:", { labels, datasets: [{ data: aggr }] });
  };
  const generateLabels = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
  
    const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    let labels = [];
  
    if (diffDays <= 7) {
      // Generate labels by day
      labels = Array.from({ length: diffDays + 1 }, (_, i) => {
        const date = new Date(start);
        date.setUTCDate(start.getUTCDate() + i);
        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        return `${day}-${month}`;
      });
    } else if (diffDays <= 28) {
      // Generate labels by week
      labels = Array.from({ length: Math.ceil(diffDays / 7) }, (_, i) => {
        const date = new Date(start);
        date.setUTCDate(start.getUTCDate() + i * 7);
        return `Week ${i + 1}`;
      });
    } else if (diffDays <= 365) {
      // Generate labels by month
      const startMonth = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), 1));
      const endMonth = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth() + 1, 0));
      labels = [];
      let date = new Date(startMonth);
      while (date <= endMonth) {
        labels.push(`${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`);
        date.setUTCMonth(date.getUTCMonth() + 1);
      }
    } else {
      // Generate labels by year
      const startYear = start.getUTCFullYear();
      const endYear = end.getUTCFullYear();
      labels = Array.from({ length: endYear - startYear + 1 }, (_, i) => String(startYear + i));
    }
  
    return labels;
  };
  


  return (
    <ScrollView style={styles.container}>
       <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Workout Summary</Text>
      </View>
      <View style={styles.summaryContainer}>
     
        <View style={styles.summaryBox}>
          <Text style={styles.summaryText}>Total Workouts</Text>
          <Text style={styles.summaryNumber}>{totalWorkouts}</Text>
        </View>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryText}>Max Strength</Text>
          <Text style={styles.summaryNumber}>{maxStrength}</Text>
        </View>
      </View>
      <DateRangePickerComponent onConfirm={handleDateConfirm} />
      <View style={styles.sectionHeaderContainer}>
        <Text style={styles.sectionHeaderText}>Max Strength</Text>
      </View>
      <View style={styles.graphContainer}>
        {filteredStrengthData.data && filteredStrengthData.data.length>0 &&  (<GraphComponent 
          width={screenWidth - 20}
          height={300}
          datasets={[filteredStrengthData.data]}
          labels={filteredStrengthData.labels}
          legend={[]}
        />)}
         <View style={styles.sectionHeaderContainer}>
        <Text style={styles.sectionHeaderText}>Workout Reports</Text>
      </View>
        {aggregatedData.labels && (
        <BarChartComponent data={aggregatedData} />
      )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 10,
    backgroundColor: '#F5F5F5',
  },
  headerContainer: {
    //backgroundColor: '#6200EE',
    padding: 16,
  },
  headerText: {
    fontSize: 24,
    
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },

  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginBottom: 20,
  },
  summaryBox: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 5,
  },
  summaryText: {
    fontSize: 16,
    color: '#7F7F7F',
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionHeaderContainer: {
    alignItems:'center',
    marginTop:20,
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },

  reportContainer: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  graphContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
});

export default WorkoutReportScreen;
