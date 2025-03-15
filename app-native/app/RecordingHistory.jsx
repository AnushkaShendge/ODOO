import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useLocalSearchParams, useRouter } from 'expo-router';

const RecordingHistory = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  
  // Parse recordings with error handling
  let parsedRecordings = [];
  try {
    parsedRecordings = params.recordings ? JSON.parse(params.recordings) : [];
  } catch (error) {
    console.error('Error parsing recordings:', error);
  }
  const recordings = parsedRecordings;

  const [sound, setSound] = React.useState(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentPlayingId, setCurrentPlayingId] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);

  // Clean up sound when component unmounts
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (error) {
      return 'Invalid date';
    }
  };

  const playSound = async (uri, id) => {
    try {
      setIsLoading(true);
      console.log('Attempting to play:', uri);
      
      // If there's already a sound playing, unload it
      if (sound) {
        await sound.unloadAsync();
      }
      
      // Configure audio session for playback
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: true,
      });
      
      // Create and load the sound
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true },
        onPlaybackStatusUpdate
      );
      
      setSound(newSound);
      setIsPlaying(true);
      setCurrentPlayingId(id);
      setIsLoading(false);
      
      // Play the sound
      await newSound.playAsync();
    } catch (error) {
      console.log('Error playing sound:', error);
      alert('Error playing recording: ' + error.message);
      setIsLoading(false);
      setCurrentPlayingId(null);
    }
  };

  const onPlaybackStatusUpdate = (status) => {
    if (status.didJustFinish) {
      setIsPlaying(false);
      setCurrentPlayingId(null);
    } else if (status.error) {
      console.log('Playback error:', status.error);
      alert('Error during playback');
      setIsPlaying(false);
      setCurrentPlayingId(null);
    }
  };

  const pauseSound = async () => {
    try {
      if (sound) {
        await sound.pauseAsync();
        setIsPlaying(false);
      }
    } catch (error) {
      console.log('Error pausing sound:', error);
    }
  };

  const resumeSound = async () => {
    try {
      if (sound) {
        await sound.playAsync();
        setIsPlaying(true);
      }
    } catch (error) {
      console.log('Error resuming sound:', error);
    }
  };

  const stopSound = async () => {
    try {
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
        setIsPlaying(false);
        setCurrentPlayingId(null);
      }
    } catch (error) {
      console.log('Error stopping sound:', error);
    }
  };

  const handlePlayButtonPress = (item) => {
    if (currentPlayingId === item.id) {
      // If this recording is already selected
      isPlaying ? pauseSound() : resumeSound();
    } else {
      // If this is a different recording or no recording is playing
      playSound(item.uri, item.id);
    }
  };

  const renderRecording = ({ item }) => (
    <TouchableOpacity 
      style={styles.recordingItem}
      onPress={() => handlePlayButtonPress(item)}
    >
      <View style={styles.recordingInfo}>
        <Ionicons name="mic" size={24} color="#666" />
        <View style={styles.recordingDetails}>
          <Text style={styles.recordingDate}>{formatDate(item.date)}</Text>
          <Text style={styles.recordingDuration}>Duration: {item.duration}</Text>
          <Text style={styles.recordingPath} numberOfLines={1} ellipsizeMode="middle">{item.fileName}</Text>
        </View>
      </View>
      <View style={styles.controls}>
        {currentPlayingId === item.id && isLoading ? (
          <ActivityIndicator size="small" color="#666" />
        ) : (
          <>
            {currentPlayingId === item.id && (
              <TouchableOpacity onPress={stopSound} style={styles.controlButton}>
                <Ionicons name="stop" size={24} color="#666" />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => handlePlayButtonPress(item)} style={styles.controlButton}>
              <Ionicons 
                name={currentPlayingId === item.id ? 
                  (isPlaying ? "pause" : "play") : "play"} 
                size={24} 
                color="#666" 
              />
            </TouchableOpacity>
          </>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Recording History</Text>
      </View>

      {recordings.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No recordings yet</Text>
        </View>
      ) : (
        <FlatList
          data={recordings}
          renderItem={renderRecording}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 47,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
  },
  recordingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    marginBottom: 12,
  },
  recordingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  recordingDetails: {
    marginLeft: 16,
    flex: 1,
  },
  recordingDate: {
    fontSize: 16,
    fontWeight: '500',
  },
  recordingDuration: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  recordingPath: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 70,
    justifyContent: 'flex-end',
  },
  controlButton: {
    padding: 8,
  },
});

export default RecordingHistory;