import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const StatsScreen = ({ route }) => {
  const { speedData } = route.params;
  console.log(speedData.length);
  return (
    <View style={styles.container}>
      <LineChart
        data={{
          labels: speedData.map((_, index) => {
            if (index % 5 === 0) {
              return index.toString();
            } else {
              return ''; // Hide labels for other data points
            }
          }),
          datasets: [
            {
              data: speedData,
              strokeWidth: 2,
            },
          ],
        }}
        width={Dimensions.get('window').width - 16}
        height={220}
        yAxisLabel=""
        chartConfig={{
          backgroundColor: '#e26a00',
          backgroundGradientFrom: '#fb8c00',
          backgroundGradientTo: '#ffa726',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '1',
            strokeWidth: '1',
            stroke: '#ffa726',
          },
        }}
        bezier // Ensure this prop is set correctly for smooth curves
        xLabelsOffset={-10} // Adjust as needed to shift the labels
        xLabelsInterval={5} // Show labels at intervals
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    </View>
  );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default StatsScreen;
