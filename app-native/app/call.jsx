import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  StatusBar 
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const CallScreen = () => {
  const params = useLocalSearchParams();
  const { name = 'Unknown', phone = '' } = params;
  
  const [callStatus, setCallStatus] = useState('ringing');
  const [callTime, setCallTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);

  useEffect(() => {
    // Simulate call being answered after 3 seconds
    const answerTimer = setTimeout(() => {
      setCallStatus('ongoing');
      startCallTimer();
    }, 3000);

    return () => clearTimeout(answerTimer);
  }, []);

  const startCallTimer = () => {
    const timer = setInterval(() => {
      setCallTime(prevTime => prevTime + 1);
    }, 1000);

    return () => clearInterval(timer);
  };

  const formatCallTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleMute = () => setIsMuted(!isMuted);
  const toggleSpeaker = () => setIsSpeaker(!isSpeaker);
  const endCall = () => {
    // Add navigation back to the call list screen
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Caller Info */}
      <View style={styles.callerInfoContainer}>
        <View style={styles.callerAvatar}>
          <Text style={styles.callerInitial}>{name.charAt(0)}</Text>
        </View>
        <Text style={styles.callerName}>{name}</Text>
        <Text style={styles.callerStatus}>
          {callStatus === 'ringing' ? 'Calling...' : formatCallTime(callTime)}
        </Text>
      </View>
      
      {/* Call Controls */}
      <View style={styles.controlsContainer}>
        <View style={styles.controlsRow}>
          <TouchableOpacity style={styles.controlButton} onPress={toggleMute}>
            <FontAwesome name={isMuted ? "microphone-slash" : "microphone"} size={24} color="white" />
            <Text style={styles.controlText}>Mute</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.controlButton} onPress={toggleSpeaker}>
            <FontAwesome 
              name="volume-up" 
              size={24} 
              color={isSpeaker ? "#4CAF50" : "white"} 
            />
            <Text style={styles.controlText}>Speaker</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.controlButton}>
            <FontAwesome name="keyboard" size={24} color="white" />
            <Text style={styles.controlText}>Keypad</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.endCallButton} onPress={endCall}>
          <FontAwesome name="phone" size={28} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    justifyContent: 'space-between',
  },
  callerInfoContainer: {
    alignItems: 'center',
    marginTop: 100,
  },
  callerAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FF4F93',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  callerInitial: {
    fontSize: 60,
    fontWeight: 'bold',
    color: 'white',
  },
  callerName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  callerStatus: {
    fontSize: 16,
    color: '#BBBBBB',
  },
  controlsContainer: {
    padding: 20,
    paddingBottom: 50,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 40,
  },
  controlButton: {
    alignItems: 'center',
  },
  controlText: {
    color: 'white',
    marginTop: 8,
  },
  endCallButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FF4F4F',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    transform: [{ rotate: '135deg' }],
  },
});

export default CallScreen;