import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  StatusBar, 
  ActivityIndicator, 
  FlatList 
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const RecordingsScreen = () => {
  const [loading, setLoading] = useState(true);
  
  // Sample recording data
  const [recordings, setRecordings] = useState([
    {
      id: '1',
      date: '13/03/2025',
      duration: '13 secs',
    },
    // More recordings can be added here
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setRecordings(prevRecordings => [
        ...prevRecordings,
        {
          id: '2',
          date: '12/03/2025',
          duration: '45 secs',
        },
        {
          id: '3',
          date: '10/03/2025',
          duration: '2 mins 15 secs',
        },
        {
          id: '4',
          date: '08/03/2025',
          duration: '35 secs',
        },
      ]);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const renderRecordingItem = ({ item }) => (
    <TouchableOpacity style={styles.recordingItem}>
      <View style={styles.recordingItemContent}>
        <View style={styles.recordingIconContainer}>
          <FontAwesome5 name="video" size={22} color="white" />
        </View>
        <View style={styles.recordingDetails}>
          <Text style={styles.recordingTitle}>Recorded On</Text>
          <Text style={styles.recordingDate}>{item.date}{' '}
            <Text style={styles.recordingDuration}>Lasted for {item.duration}</Text>
          </Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#999" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <View style={styles.safeArea} />
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.safeArea} />
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Recordings</Text>
          <Text style={styles.headerSubtitle}>Detailed history of the recorded event</Text>
        </View>
      </View>
      
      <FlatList
        data={recordings}
        renderItem={renderRecordingItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListFooterComponent={
          loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#694fad" />
              <Text style={styles.loadingText}>Loading previous history.</Text>
            </View>
          ) : null
        }
      />
      
      {/* Bottom Indicator */}
      <View style={styles.bottomIndicator} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  safeArea: {
    height: StatusBar.currentHeight || 47,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#999',
    marginTop: 2,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  recordingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    borderRadius: 12,
    marginTop: 16,
    paddingHorizontal: 16,
  },
  recordingItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recordingIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  recordingDetails: {
    flex: 1,
  },
  recordingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  recordingDate: {
    fontSize: 14,
    color: '#000',
    marginTop: 4,
  },
  recordingDuration: {
    color: '#999',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  loadingText: {
    marginLeft: 12,
    color: '#999',
    fontSize: 14,
  },
  bottomIndicator: {
    height: 5,
    width: 60,
    backgroundColor: '#DDD',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 10,
    marginTop: 5,
  },
});

export default RecordingsScreen;