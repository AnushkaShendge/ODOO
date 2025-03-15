import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  StatusBar, 
  ActivityIndicator, 
  FlatList,
  Animated,
  Platform,
  Share
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import Header from '../../components/Header';
import { Audio } from 'expo-av';
import { Camera } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const RecordingsScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [photoInterval, setPhotoInterval] = useState(null);
  const [waveformAnimation] = useState(new Animated.Value(0));
  const [hasPermission, setHasPermission] = useState(null);
  const [savedRecordings, setSavedRecordings] = useState([]);
  
  // Create app directory for storing recordings
  const APP_DIRECTORY = FileSystem.documentDirectory + 'recordings/';
  
  // Ensure directory exists
  useEffect(() => {
    const setupDirectory = async () => {
      const dirInfo = await FileSystem.getInfoAsync(APP_DIRECTORY);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(APP_DIRECTORY, { intermediates: true });
        console.log('Created recordings directory at:', APP_DIRECTORY);
      }
      
      // Load existing recordings
      loadSavedRecordings();
    };
    
    setupDirectory().catch(error => {
      console.log('Error setting up directory:', error);
    });
  }, []);
  
  // Function to load saved recordings
  const loadSavedRecordings = async () => {
    try {
      const files = await FileSystem.readDirectoryAsync(APP_DIRECTORY);
      const recordings = [];
      
      for (const file of files) {
        if (file.endsWith('.m4a')) {
          // Extract date from filename (assuming format: recording-TIMESTAMP.m4a)
          const timestamp = file.split('-')[1]?.split('.')[0];
          const date = timestamp ? new Date(parseInt(timestamp)).toLocaleDateString() : 'Unknown date';
          
          recordings.push({
            id: file,
            uri: APP_DIRECTORY + file,
            date,
            duration: '00:00', // You could store/calculate actual duration if needed
            type: 'audio'
          });
        }
      }
      
      setSavedRecordings(recordings);
      setLoading(false);
    } catch (error) {
      console.log('Error loading recordings:', error);
      setLoading(false);
    }
  };

  const requestPermissions = async () => {
    try {
      const { status: cameraStatus } = await Camera.getCameraPermissionsAsync();
      if (cameraStatus !== 'granted') {
        const { status } = await Camera.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          alert('Camera permission is required');
          return false;
        }
      }

      const { status: audioStatus } = await Audio.requestPermissionsAsync();
      if (audioStatus !== 'granted') {
        alert('Audio permission is required');
        return false;
      }

      setHasPermission(true);
      return true;
    } catch (error) {
      console.log('Error requesting permissions:', error);
      alert('Error requesting permissions: ' + error.message);
      return false;
    }
  };

  useEffect(() => {
    requestPermissions();
    return () => {
      // Cleanup if needed
      if (recording) {
        recording.stopAndUnloadAsync();
      }
    };
  }, []);

  // Animate recording waveform
  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(waveformAnimation, {
            toValue: 1,
            duration: 800,
            useNativeDriver: false,
          }),
          Animated.timing(waveformAnimation, {
            toValue: 0,
            duration: 800,
            useNativeDriver: false,
          }),
        ])
      ).start();
    } else {
      waveformAnimation.setValue(0);
    }
  }, [isRecording]);

  // Generate a filename for the recording
  const getRecordingFilename = () => {
    const timestamp = Date.now();
    return `recording-${timestamp}.m4a`;
  };

  // Start recording function
  const startRecording = async () => {
    if (!hasPermission) {
      const granted = await requestPermissions();
      if (!granted) {
        alert('Camera and audio permissions are required');
        return;
      }
    }
    
    try {
      // Configure audio recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      
      // Start audio recording
      const { recording: audioRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(audioRecording);
      
      // Take photos every 5 seconds
      const interval = setInterval(() => {
        console.log('Would take photo here if camera was available');
      }, 5000);
      
      setPhotoInterval(interval);
      setIsRecording(true);
    } catch (error) {
      console.log('Error starting recording:', error);
      alert('Failed to start recording: ' + error.message);
    }
  };

  // Stop recording function
  const stopRecording = async () => {
    try {
      if (recording) {
        await recording.stopAndUnloadAsync();
        const tempUri = recording.getURI();
        
        // Create a permanent filename
        const newFilename = getRecordingFilename();
        const newUri = APP_DIRECTORY + newFilename;
        
        // Copy from temp location to our app directory
        await FileSystem.copyAsync({
          from: tempUri,
          to: newUri
        });
        
        // Delete the original temp file
        try {
          await FileSystem.deleteAsync(tempUri);
        } catch (e) {
          console.log('Could not delete temp file (this is usually fine)', e);
        }
        
        // Save recording to state
        const newRecording = {
          id: newFilename,
          uri: newUri,
          date: new Date().toLocaleDateString(),
          duration: '00:00', // You can calculate actual duration if needed
          type: 'audio'
        };
        
        setSavedRecordings(prev => [...prev, newRecording]);
        console.log('Recording saved at', newUri);
      }
      
      if (photoInterval) {
        clearInterval(photoInterval);
        setPhotoInterval(null);
      }
      
      // Reset audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });
      
      setRecording(null);
      setIsRecording(false);
    } catch (error) {
      console.log('Error stopping recording:', error);
      alert('Error saving recording: ' + error.message);
    }
  };
  
  // Share/export a recording
  const shareRecording = async (recordingUri) => {
    try {
      if (Platform.OS === 'android') {
        const shareResult = await Share.share({
          url: recordingUri,
          title: 'Share Recording'
        });
      } else {
        // iOS
        await Sharing.shareAsync(recordingUri);
      }
    } catch (error) {
      console.log('Error sharing recording:', error);
      alert('Could not share recording');
    }
  };

  // Navigate to recording history
  const handleHistoryPress = () => {
    navigation.navigate('RecordingHistory', { recordings: savedRecordings });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <View style={styles.safeArea} />
      {/* Header */}
      <Header />
      <View style={styles.header}>
        <View style={styles.safeArea} />
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Recordings</Text>
          <Text style={styles.headerSubtitle}>Detailed history of the recorded event</Text>
        </View>
      </View>

      {/* Corrected Recording History Button */}
      <TouchableOpacity 
        style={styles.historyButton}
        onPress={handleHistoryPress}
      >
        <View style={styles.recordingItemContent}>
          <View style={styles.recordingIconContainer}>
            <FontAwesome5 name="history" size={22} color="white" />
          </View>
          <View style={styles.recordingDetails}>
            <Text style={styles.historyButtonText}>Recording History</Text>
            <Text style={styles.recordingCount}>{savedRecordings.length} recordings saved</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#999" />
      </TouchableOpacity>
      
      <View style={styles.mainContent}>
        {/* Recording Waveform Visualization */}
        {isRecording && (
          <View style={styles.waveformContainer}>
            {[...Array(5)].map((_, index) => (
              <Animated.View 
                key={index}
                style={[
                  styles.waveformLine,
                  { 
                    height: waveformAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [10, 40 + index * 5]
                    })
                  }
                ]}
              />
            ))}
          </View>
        )}
        
        {/* Record Button */}
        <TouchableOpacity
          style={[styles.recordButton, isRecording ? styles.recordingButtonActive : {}]}
          onPress={isRecording ? stopRecording : startRecording}
        >
          <View style={[styles.recordIcon, isRecording ? styles.recordingActive : styles.recordingInactive]}>
          </View>
          <Text style={styles.recordButtonText}>
            {isRecording ? "Stop Recording" : "Start Recording"}
          </Text>
        </TouchableOpacity>
        
        {/* Storage location info */}
        <View style={styles.storageInfo}>
          <Text style={styles.storageText}>
            Recordings saved to app's document directory
          </Text>
        </View>
      </View>
      
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
  // Updated styles for recording history button
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 16,
    backgroundColor: '#f9f9f9',
  },
  historyButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  recordingCount: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
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
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButton: {
    backgroundColor: 'black',
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
  },
  recordingButtonActive: {
    backgroundColor: '#d32f2f',
  },
  recordIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 16,
  },
  recordingInactive: {
    backgroundColor: '#f44336', // Red
  },
  recordingActive: {
    backgroundColor: '#ffffff', // White
  },
  recordButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
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
  // New styles for recording visualization
  waveformContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    height: 60,
  },
  waveformLine: {
    width: 4,
    marginHorizontal: 4,
    backgroundColor: '#f44336',
    borderRadius: 2,
  },
  storageInfo: {
    position: 'absolute',
    bottom: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  storageText: {
    color: '#999',
    fontSize: 12,
    textAlign: 'center',
  },
});

export default RecordingsScreen;