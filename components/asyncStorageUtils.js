import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    console.log("heyyy");
  } catch (error) {
    console.error('Error saving data:', error);
  }
};

export const loadData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error('Error loading data:', error);
    return null;
  }
};

export const resetAsyncStorage = async (keys = null) => {
    try {
      if (keys && Array.isArray(keys)) {
        // Reset specific keys
        const promises = keys.map(key => AsyncStorage.removeItem(key));
        await Promise.all(promises);
        console.log('Specified keys have been reset');
      } else {
        // Reset all keys
        await AsyncStorage.clear();
        console.log('AsyncStorage has been reset completely');
      }
    } catch (error) {
      console.error('Error resetting AsyncStorage:', error);
    }
  };
  
  
