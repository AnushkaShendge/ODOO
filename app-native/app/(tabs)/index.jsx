import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapPage from '../../components/MapPage';
import Header from '../../components/Header';

const { width, height } = Dimensions.get('window');

export default function TrackMeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.safeArea} />

      {/* Header */}
      <Header />

      {/* Title Section */}
      <View style={styles.titleSection}>
        <Text style={styles.title}>Track me</Text>
        <Text style={styles.subtitle}>
          Share live location with your friends
        </Text>
      </View>
      
      {/* Add Friend Section */}
      <View style={styles.addFriendSection}>
        <View>
          <Text style={styles.addFriendTitle}>Add Friend</Text>
          <Text style={styles.addFriendSubtitle}>
            Add a friend to use SOS and Track me
          </Text>
        </View>
        <TouchableOpacity style={styles.addFriendsButton}>
          <Text style={styles.addFriendsButtonText}>Add friends</Text>
        </TouchableOpacity>
      </View>
      
      {/* Map View */}
      <View style={styles.mapContainer}>
        <MapPage />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  safeArea: {
    height: StatusBar.currentHeight || 47,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIconContainer: {
    marginRight: 8,
  },
  logoText: {
    color: '#FF4F93',
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 20,
  },
  titleSection: {
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
  },
  addFriendSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  addFriendTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  addFriendSubtitle: {
    fontSize: 14,
    color: '#888',
    maxWidth: 200,
  },
  addFriendsButton: {
    backgroundColor: '#4E1158',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addFriendsButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  mapContainer: {
    flex: 1,
  },
});