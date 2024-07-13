import React from 'react';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions, View, StyleSheet } from 'react-native';

const GraphComponent = ({ width, height, datasets, labels, legend, showLegend}) => {
  const myWidth =  width;
  console.log("my width:",myWidth,width);
  return (
    <View style={styles.chartContainer}>
      <LineChart
        data={{
          labels: labels,
          datasets: datasets.map((data, index) => ({
            data: data,
            color: (opacity = 1) => `rgba(${64 * (index + 1)}, ${203 - index * 30}, ${205 + index * 30}, ${opacity})`, // Different colors for different datasets
          })),
          legend: legend
          
        }}
        hasLegend = {false}
        width={myWidth}
        height={height}
        yAxisLabel=""
        yAxisSuffix="lb"
        yAxisInterval={1} // optional, defaults to 1
        chartConfig={{
          backgroundColor: '#fff',
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          decimalPlaces: 1, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(64, 203, 205, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: '#64FF00'
          },
          propsForHorizontalLabels: {
            baselineShift: -10
          },
          propsForVerticalLabels: {
            dx: 10,
            dy: 5
          },
        }}
        bezier
        style={styles.chart}
        fromZero={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    padding: 16, // Add padding around the chart
  },
  chart: {
    borderRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 5,
  },
});

export default GraphComponent;
