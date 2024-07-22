// App.js
import 'react-native-gesture-handler';
import React from 'react';
import { View, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DataProvider } from './BLEContext';
import { Provider } from 'react-redux';
import { store } from './src/store/store';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// Import your screens
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import QuestionsScreen from './screens/QuestionsScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import SettingsScreen from './screens/SettingsScreen';
import WorkoutScreen from './screens/WorkoutScreen';
import MainScreen from './screens/MainScreen';
import StatsScreen from './screens/StatsScreen';
import NameScreen from './screens/NameScreen';
import GenderScreen from './screens/GenderScreen';
import DateOfBirthScreen from './screens/DateOfBirthScreen';
import WeightHeightScreen from './screens/WeightHeightScreen';
import FitnessLevelScreen from './screens/FitnessLevelScreen';
import HeartConditionScreen from './screens/HeartConditionScreen';
import BLEConnectionScreen from './screens/BLEConnectionScreen';
import GripStrengthenerControlScreen from './screens/GripStrengthenerControlScreen';
import WorkoutReportScreen from './screens/WorkoutReportScreen';
import BottomTabNavigator from './Navigation/BottomTabNavigator'; // Import the BottomTabNavigator
import ProtocolDetailScreen from './screens/ProtocolDetailScreen';
import AgeGroupScreen from './screens/AgeGroupScreen';
import GaolsScreen from './screens/GoalsScreen';
import { TransitionPresets } from '@react-navigation/stack';
import ProfileScreen from './screens/ProfileScreen';
import EditProfileScreen from './screens/EditProfileScreen';
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const DrawerNavigator = () => (
  <Drawer.Navigator initialRouteName="Landing">
    <Drawer.Screen name="Welcome" component={WelcomeScreen} />
    <Drawer.Screen name="Workout" component={WorkoutScreen} />
    <Drawer.Screen name="Settings" component={SettingsScreen} />
    <Drawer.Screen name="Main" component={MainScreen} />
  </Drawer.Navigator>
);

const AppNavigator = () => (
  <Stack.Navigator 
  screenOptions={{
    headerShown: false,
    gestureEnabled: true,
    cardOverlayEnabled: true,
    ...TransitionPresets.DefaultTransition,
  }}
  initialRouteName="Login">
     <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
    <Stack.Screen name="BLEConnection" component={BLEConnectionScreen} options={{ headerShown: false }} />
     <Stack.Screen name="GripStrengthenerControl" component={GripStrengthenerControlScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Stats" component={StatsScreen} />
    <Stack.Screen name="Workout" component={WorkoutScreen} options={{ headerShown: false }}/>
    <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }}/>
    <Stack.Screen name="Questions" component={QuestionsScreen} />
    <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }}/>
    <Stack.Screen name="WorkoutReport" component={WorkoutReportScreen} options={{ headerShown: false }}/>
    <Stack.Screen name="Drawer" component={DrawerNavigator} options={{ headerShown: false }} />
    <Stack.Screen name="Name" component={NameScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Gender" component={GenderScreen} options={{ headerShown: false }} />
    <Stack.Screen name="DateOfBirth" component={DateOfBirthScreen} options={{ headerShown: false }} />
    <Stack.Screen name="AgeGroup" component={AgeGroupScreen} options={{ headerShown: false }} />
    <Stack.Screen name="WeightHeight" component={WeightHeightScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Goals" component={GaolsScreen} options={{ headerShown: false }} />
    <Stack.Screen name="FitnessLevel" component={FitnessLevelScreen} options={{ headerShown: false }} />
    <Stack.Screen name="HeartCondition" component={HeartConditionScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
    <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ headerShown: false }} />
    <Stack.Screen name="ProtocolDetail" component={ProtocolDetailScreen} options={{ headerShown: false }} />
    <Stack.Screen 
    name="BottomTabs" 
    component={BottomTabNavigator}
    options={{ headerShown: false }}
    initialParams={{  userId:'' }} /> 
    
     {/* Add the BottomTabNavigator */}
  </Stack.Navigator>
);

const App = () => {
  return (
    <Provider store={store}>
      <DataProvider>
        <SafeAreaProvider>
          <StatusBar translucent backgroundColor="transparent" />
          <View style={{ flex: 1 }}>
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
          </View>
        </SafeAreaProvider>
      </DataProvider>
    </Provider>
  );
};

export default App;
