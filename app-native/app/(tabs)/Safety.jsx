import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar, 
  SafeAreaView 
} from 'react-native';
import { 
  Ionicons, 
  Feather,
  MaterialCommunityIcons 
} from '@expo/vector-icons';

const SafetyScreen = () => {
  const [countdown, setCountdown] = useState(5);
  const [recordTime, setRecordTime] = useState(63); // 01:03 in seconds
  
  // Timer effect for countdown
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);
  
  // Format seconds to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF5A5F" />
      <View style={styles.safeArea} />
      {/* Top section with status icons */}
      <View style={styles.statusBar}>
        <Text style={styles.timeText}>3:08</Text>
        
        <View style={styles.recordingContainer}>
          <Feather name="circle" size={12} color="white" style={styles.recordIcon} />
          <Text style={styles.recordingTime}>{formatTime(recordTime)}</Text>
        </View>
        
        <View style={styles.iconContainer}>
          <Ionicons name="bluetooth" size={16} color="white" style={styles.statusIcon} />
          <MaterialCommunityIcons name="bluetooth-audio" size={16} color="white" style={styles.statusIcon} />
          <Ionicons name="wifi" size={16} color="white" style={styles.statusIcon} />
          <Ionicons name="cellular" size={16} color="white" style={styles.statusIcon} />
          <View style={styles.batteryContainer}>
            <Text style={styles.batteryText}>32%</Text>
            <Ionicons name="battery-half" size={16} color="white" style={styles.statusIcon} />
          </View>
        </View>
      </View>
      
      {/* Main content */}
      <View style={styles.contentContainer}>
        <View style={styles.logoContainer}>
          <Feather name="feather" size={40} color="white" />
          <Text style={styles.safeText}>I'M SAFE</Text>
        </View>
        
        <Text style={styles.notifyingText}>Notifying your SOS contacts in</Text>
        
        <View style={styles.countdownContainer}>
          <Text style={styles.countdownText}>{countdown}</Text>
        </View>
      </View>
      
      {/* Bottom buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton}>
          <Text style={styles.cancelText}>Cancel SOS</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.skipButton}>
          <Text style={styles.skipText}>Skip Countdown</Text>
        </TouchableOpacity>
      </View>
      
      {/* Home indicator */}
      <View style={styles.homeIndicator}>
        <View style={styles.homeIndicatorBar} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF5A5F',
  },
  safeArea: {
    height: StatusBar.currentHeight || 47,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 5,
  },
  timeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  recordingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  recordIcon: {
    color: 'red',
    marginRight: 5,
  },
  recordingTime: {
    color: 'white',
    fontWeight: 'bold',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    marginHorizontal: 2,
  },
  batteryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  batteryText: {
    color: 'white',
    fontSize: 12,
    marginRight: 2,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 80,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  safeText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 10,
  },
  notifyingText: {
    color: 'white',
    fontSize: 18,
    marginBottom: 20,
  },
  countdownContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  countdownText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FF5A5F',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 25,
    width: '48%',
    alignItems: 'center',
  },
  cancelText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  skipButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 25,
    width: '48%',
    alignItems: 'center',
  },
  skipText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  homeIndicator: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  homeIndicatorBar: {
    width: 134,
    height: 5,
    backgroundColor: 'white',
    borderRadius: 3,
  },
});

export default SafetyScreen;