import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';

const RecordingDetailsScreen = () => {
  const [activeTab, setActiveTab] = useState('photos');
  
  const recordInfo = {
    date: '13/03/2025',
    time: '01:42 AM',
    duration: '13 secs',
    location: 'Highland Park Cooperative Housing Society 1 Highland Park Cooperative Housing Society-1, Mulund West, Konkan Division, 400082'
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'photos':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.warningText}>Photos may not be captured due to,</Text>
            <Text style={styles.listItem}>1. Your phone's camera being utilised by another application.</Text>
            <Text style={styles.listItem}>2. Recording session being too short (minimum duration required is 30 seconds).</Text>
          </View>
        );
      case 'audios':
        return (
          <View style={styles.tabContent}>
            <View style={styles.audioPlayerContainer}>
              <View style={styles.audioProgressBar}>
                <View style={styles.audioProgress} />
              </View>
              <TouchableOpacity style={styles.playButton}>
                <Ionicons name="play" size={18} color="#000" />
              </TouchableOpacity>
              <Text style={styles.audioTime}>{recordInfo.time}</Text>
            </View>
          </View>
        );
      case 'location':
        return (
          <View style={styles.tabContent}>
            <View style={styles.locationContainer}>
              <Text style={styles.locationLabel}>Initial time</Text>
              <Text style={styles.locationTime}>{recordInfo.time}</Text>
              
              <View style={styles.mapThumbnail}>
                <View style={styles.mapPlaceholder} />
              </View>
              
              <Text style={styles.locationLabel}>Location</Text>
              <Text style={styles.locationText}>{recordInfo.location}</Text>
              
              <Text style={styles.locationLabel}>Final time</Text>
              <Text style={styles.locationTime}>{recordInfo.time}</Text>
              
              <View style={styles.mapThumbnail}>
                <View style={styles.mapPlaceholder} />
              </View>
              
              <Text style={styles.locationLabel}>Location</Text>
              <Text style={styles.locationText}>{recordInfo.location}</Text>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#f9f9f9" barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#555" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Record</Text>
      </View>
      
      <ScrollView style={styles.scrollView}>
        <Text style={styles.subtitle}>Detailed history of the recorded event</Text>
        
        {/* Recording Info */}
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <MaterialIcons name="video-library" size={20} color="#fff" />
            </View>
            <Text style={styles.infoText}>Recorded on {recordInfo.date} at {recordInfo.time}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.timerIconContainer}>
              <Ionicons name="time-outline" size={18} color="#888" />
            </View>
            <Text style={styles.infoText}>Record Lasted for {recordInfo.duration}</Text>
          </View>
        </View>
        
        <Text style={styles.captureText}>
          The pictures, audio and location information were captured during the anonymous record session.
        </Text>
        
        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'photos' && styles.activeTab]} 
            onPress={() => setActiveTab('photos')}
          >
            <MaterialIcons name="photo" size={18} color={activeTab === 'photos' ? "#fff" : "#000"} />
            <Text style={[styles.tabText, activeTab === 'photos' && styles.activeTabText]}>Photos</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'audios' && styles.activeTab]} 
            onPress={() => setActiveTab('audios')}
          >
            <Feather name="mic" size={18} color={activeTab === 'audios' ? "#fff" : "#000"} />
            <Text style={[styles.tabText, activeTab === 'audios' && styles.activeTabText]}>Audios</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'location' && styles.activeTab]} 
            onPress={() => setActiveTab('location')}
          >
            <Ionicons name="location-outline" size={18} color={activeTab === 'location' ? "#fff" : "#000"} />
            <Text style={[styles.tabText, activeTab === 'location' && styles.activeTabText]}>Location</Text>
          </TouchableOpacity>
        </View>
        
        {/* Tab Content */}
        {renderTabContent()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '500',
    marginLeft: 15,
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  subtitle: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  infoContainer: {
    paddingHorizontal: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  timerIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
  },
  captureText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginVertical: 20,
    paddingHorizontal: 40,
    lineHeight: 22,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  activeTab: {
    backgroundColor: '#36213E',
  },
  tabText: {
    marginLeft: 6,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#fff',
  },
  tabContent: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  warningText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  listItem: {
    fontSize: 16,
    color: '#666',
    marginLeft: 20,
    marginBottom: 15,
    lineHeight: 22,
  },
  audioPlayerContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  audioProgressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#ddd',
    borderRadius: 2,
  },
  audioProgress: {
    width: '10%',
    height: 4,
    backgroundColor: '#36213E',
    borderRadius: 2,
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  audioTime: {
    marginLeft: 10,
    fontSize: 14,
    color: '#666',
  },
  locationContainer: {
    paddingVertical: 10,
  },
  locationLabel: {
    fontSize: 15,
    color: '#666',
    marginTop: 15,
    marginBottom: 5,
  },
  locationTime: {
    fontSize: 16,
    color: '#444',
    fontWeight: '500',
    marginBottom: 10,
  },
  mapThumbnail: {
    height: 80,
    marginBottom: 10,
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#e9e9e9',
    borderRadius: 6,
  },
  locationText: {
    fontSize: 16,
    color: '#444',
    lineHeight: 22,
    marginBottom: 20,
  },
});

export default RecordingDetailsScreen;
