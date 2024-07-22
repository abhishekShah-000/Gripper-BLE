
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { API_URL } from '@env';
const ProfileScreen = () => {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const [user, setProfile] = useState([]);
    const userId = useSelector((state) => state.user.userId);
  const token = useSelector((state) => state.user.token);
  const renderSectionHeader = (title) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );
  useEffect(() => {
    fetchProfile();
  }, [token]);
  const fetchProfile = async () => {
    try {
      console.log("Fetching students with token:", token);
      const response = await axios.get(`http://${API_URL}/users/user-profile/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
        
      });
      console.log(response.data);
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };
  const renderMenuItem = (icon, title, onPress) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Icon name={icon} size={24} color="#333" style={styles.menuIcon} />
      <Text style={styles.menuText}>{title}</Text>
      <Icon name="chevron-right" size={24} color="#888" />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: user.profilePicture || 'https://via.placeholder.com/150' }}
          style={styles.profilePicture}
        />
        <Text style={styles.name}>{user.name || 'John Doe'}</Text>
       
      </View>

      {renderSectionHeader('Personal Details')}
      {renderMenuItem('person', 'Edit Profile', () => navigation.navigate('EditProfile'))}
      {renderMenuItem('assessment', 'Reports', () => navigation.navigate('Report'))}
      {renderMenuItem('history', 'History', () => navigation.navigate('History'))}

      {renderSectionHeader('App Information')}
      {renderMenuItem('security', 'Privacy Policy', () => navigation.navigate('PrivacyPolicy'))}
      {renderMenuItem('info', 'About Us', () => navigation.navigate('AboutUs'))}
      {renderMenuItem('description', 'Terms of Service', () => navigation.navigate('TermsOfService'))}

      {renderSectionHeader('Support & Logout')}
      {renderMenuItem('help', 'Help & Support', () => navigation.navigate('HelpSupport'))}
      {renderMenuItem('exit-to-app', 'Logout', () => {/* Implement logout logic */})}
    </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  sectionHeader: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    marginTop: 20,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  menuIcon: {
    marginRight: 15,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
});

export default ProfileScreen;