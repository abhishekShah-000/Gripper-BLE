import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import DateRangePicker from "rn-select-date-range";
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';

const DateRangePickerComponent = ({ onConfirm }) => {
  const [dateRange, setDateRange] = useState({ firstDate: moment().subtract(6, 'days').format('YYYY-MM-DD'), secondDate: moment().format('YYYY-MM-DD') });
  const [isOpen, setIsOpen] = useState(false);
  const [totalDays, setTotalDays] = useState(7);

  useEffect(() => {
    const start = moment(dateRange.firstDate);
    const end = moment(dateRange.secondDate);
    const days = end.diff(start, 'days') + 1;
    setTotalDays(days);
  }, [dateRange]);

  const handleConfirm = (startDate, endDate) => {
    setDateRange({ firstDate: startDate, secondDate: endDate });
    onConfirm(startDate, endDate);
    setIsOpen(false);
  };

  const handlePresetSelect = (start, end) => {
    const formattedStart = moment(start).format('YYYY-MM-DD');
    const formattedEnd = moment(end).format('YYYY-MM-DD');
    handleConfirm(formattedStart, formattedEnd);
  };

  const presets = [
    { label: 'Today', range: [new Date(), new Date()] },
    { label: 'Yesterday', range: [moment().subtract(1, 'days').toDate(), moment().subtract(1, 'days').toDate()] },
    { label: 'This Week', range: [moment().startOf('week').toDate(), new Date()] },
    { label: 'Last Week', range: [moment().subtract(1, 'weeks').startOf('week').toDate(), moment().subtract(1, 'weeks').endOf('week').toDate()] },
    { label: 'Last 28 Days', range: [moment().subtract(28, 'days').toDate(), new Date()] },
    { label: 'Last 30 Days', range: [moment().subtract(30, 'days').toDate(), new Date()] },
    { label: 'Last 90 Days', range: [moment().subtract(90, 'days').toDate(), new Date()] },
    { label: 'Last 12 Months', range: [moment().subtract(1, 'years').toDate(), new Date()] },
  ];

  const formatDate = (date) => moment(date).format('D MMMM YY');

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setIsOpen(!isOpen)}>
        <View style={styles.dateRangeDisplay}>
          <Text style={styles.daysText}>{`${totalDays} Days`}</Text>
          <Text style={styles.dateText}>{`${formatDate(dateRange.firstDate)} - ${formatDate(dateRange.secondDate)}`}</Text>
          <Ionicons name="calendar" size={24} color="black" />
        </View>
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.pickerContainer}>
          <ScrollView horizontal style={styles.presetsContainer} showsHorizontalScrollIndicator={false}>
            {presets.map((preset, index) => (
              <TouchableOpacity
                key={index}
                style={styles.presetButton}
                onPress={() => handlePresetSelect(...preset.range)}
              >
                <Text style={styles.presetButtonText}>{preset.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <DateRangePicker
            onSelectDateRange={({ firstDate, secondDate }) =>
              handleConfirm(firstDate, secondDate)
            }
            responseFormat="YYYY-MM-DD"
            minDate={new Date(2022, 0, 1)}
            maxDate={moment().toDate()}
            selectedDateContainerStyle={styles.selectedDateContainerStyle}
            selectedDateStyle={styles.selectedDateStyle}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
  },
  dateRangeDisplay: {
    
    flexDirection:'row',
    backgroundColor: 'white',
    margin:10,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 5,
  },
  dateText: {
    margin:10,
    color: 'black',
    fontSize: 16,
  },
  daysText: {
    backgroundColor:'gainsboro',
    padding:10,
    borderRadius:10,
    color: 'black',
    fontSize: 12,
  },
  pickerContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 5,
    zIndex: 1000,
  },
  presetsContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  presetButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  presetButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  selectedDateContainerStyle: {
    height: 35,
    width: 75,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    backgroundColor: 'blue',
  },
  selectedDateStyle: {
    fontWeight: 'bold',
    color: 'white',
  },
});

export default DateRangePickerComponent;
