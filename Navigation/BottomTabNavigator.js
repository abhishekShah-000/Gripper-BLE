// BottomTabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";
// Import your screens
import MainScreen from '../screens/MainScreen';
import WorkoutReportScreen from '../screens/WorkoutReportScreen';
import WorkoutHistoryScreen from '../screens/WorkoutHistoryScreen'; // You need to create this screen
import WelcomeScreen from '../screens/WelcomeScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import WorkoutScreen from '../screens/WorkoutScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const defaultStackScreenOptions = {
    headerShown: false,
    gestureEnabled: true,
    cardOverlayEnabled: true,
    ...TransitionPresets.DefaultTransition,
    safeAreaInsets: { top: 100, bottom: 0, left: 0, right: 0 }, 
  };
const HomeStack = ({ userId }) => (
    <Stack.Navigator screenOptions={defaultStackScreenOptions}>
      <Stack.Screen name="Welcome">
        {() => <WelcomeScreen/>}
      </Stack.Screen>
      <Stack.Screen name="Workout">
        {() => <WorkoutScreen/>}
      </Stack.Screen>
      <Stack.Screen name="Main">
        {() => <MainScreen/>}
      </Stack.Screen>
  
    </Stack.Navigator>
  );
  const HistoryStack = ({ userId }) => (
    <Stack.Navigator screenOptions={defaultStackScreenOptions}>
      <Stack.Screen name="WorkoutHistoryScreen">
        {() => <WorkoutHistoryScreen userId = {userId} />}
      </Stack.Screen>
  
    </Stack.Navigator>
  );
  const ReportStack = ({ userId }) => (
    <Stack.Navigator screenOptions={defaultStackScreenOptions}>
      <Stack.Screen name="WorkoutReportScreen">
        {() => <WorkoutReportScreen userId = {userId} />}
      </Stack.Screen>
  
    </Stack.Navigator>
  );
const BottomTabNavigator = ({route}) => {
const userId  = route.params.userId;
console.log("user:",userId);
  return (
    <Tab.Navigator    
    initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'home-outline';
          } else if (route.name === 'History') {
            iconName = 'time-outline';
          } else if (route.name === 'Report') {
            iconName = 'bar-chart-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen name="Home">
        {() => <HomeStack userId={userId} />}
      </Tab.Screen>
      <Tab.Screen name="History">
        {() => <HistoryStack userId={userId} />}
      </Tab.Screen>
      <Tab.Screen name="Report">
        {() => <ReportStack userId={userId} />}
      </Tab.Screen>
     
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
