// BarChartComponent.js
import React from 'react';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions, View, StyleSheet } from 'react-native';

const BarChartComponent = ({ data }) => {
const yAxisLabels = ["1", "2", "3", "4", "5"];
  return (
    <View style={styles.container}>
      <BarChart
        data={data}
        width={Dimensions.get('window').width - 32} // from react-native
        height={300}
        xLabelsOffset = {15}
        yLabelsOffset = {30}
        yAxisLabel=""
        yAxisSuffix=""
        chartConfig={{
          backgroundColor: '#e26a00',
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          decimalPlaces: 0, // optional, defaults to 2dp
          barRadius:5,
          color: (opacity = 1) => `rgba(0, 86, 85, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          
          style: {
            borderRadius: 16
          },
          propsForHorizontalLabels:{
            baselineShift:-10
          },
          propsForVerticalLabels:{
            dx:-5,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#ffa726'
          },
        }}
        style={{ 
          marginVertical: 8,
          borderRadius: 20,
          padding:2,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 10,
          elevation: 5,
        }}
       
        showBarTops = {false}
        fromZero={true} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    borderRadius: 16,
    
  }
});

export default BarChartComponent;
