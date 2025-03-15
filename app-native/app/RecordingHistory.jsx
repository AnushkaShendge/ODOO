import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  SafeAreaView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';

const RecordingHistory = ({ route, navigation }) => {
  // Add fallback for recordings if route.params is undefined
  const recordings = route?.params?.recordings || [];
  const [sound, setSound] = React.useState();

  const playSound = async (uri) => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }
      const { sound: newSound } = await Audio.Sound.createAsync({ uri });
      setSound(newSound);
      await newSound.playAsync();
    } catch (error) {
      console.log('Error playing sound:', error);
    }
  };

  const renderRecording = ({ item }) => (
    <TouchableOpacity 
      style={styles.recordingItem}
      onPress={() => playSound(item.uri)}
    >
      <View style={styles.recordingInfo}>
        <Ionicons 
          name={item.type === 'audio' ? 'mic' : 'image'} 
          size={24} 
          color="#666"
        />
        <View style={styles.recordingDetails}>
          <Text style={styles.recordingDate}>{item.date}</Text>
          <Text style={styles.recordingDuration}>{item.duration}</Text>
        </View>
      </View>
      <Ionicons name="play" size={24} color="#666" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Recording History</Text>
      </View>

      <FlatList
        data={recordings}
        renderItem={renderRecording}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
  },
  recordingDetails: {
    marginLeft: 16,
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
});

export default RecordingHistory;
