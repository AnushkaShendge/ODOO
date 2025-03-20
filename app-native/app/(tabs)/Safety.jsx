import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar, 
  SafeAreaView, 
  TextInput, 
  BackHandler, 
  Alert 
} from 'react-native';
import { 
  Ionicons, 
  Feather,
  MaterialCommunityIcons 
} from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useSOSContext } from '../../context/SOSContext';

const SafetyScreen = () => {
  const { isSOSActive, setIsSOSActive } = useSOSContext();
  const [countdown, setCountdown] = useState(5);
  const [recordTime, setRecordTime] = useState(63);
  const [otpInput, setOtpInput] = useState('');
  const [hasTriggeredSOS, setHasTriggeredSOS] = useState(false);
  const [location, setLocation] = useState(null);

  // Timer effect for countdown
  useEffect(() => {
    if (countdown > 0 && !isSOSActive && !hasTriggeredSOS) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, isSOSActive, hasTriggeredSOS]);

  useEffect(() => {
    if (countdown === 0 && !isSOSActive && !hasTriggeredSOS) {
      triggerSOS();
      setHasTriggeredSOS(true);
    }
  }, [countdown]);

  // Prevent back navigation when SOS is active
  useEffect(() => {
    if (isSOSActive) {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        Alert.alert(
          'SOS Active',
          'Please enter the security code to deactivate SOS mode',
          [{ text: 'OK' }]
        );
        return true;
      });
      return () => backHandler.remove();
    }
  }, [isSOSActive]);

  // Format seconds to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCancel = () => {
    if (!isSOSActive) {
      setCountdown(5);
    }
  };

  const handleSkip = () => {
    if (!isSOSActive) {
      setCountdown(0);
    }
  };

  const triggerSOS = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required for SOS');
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const response = await fetch('http://192.168.80.60:5000/api/sos/trigger', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: 'JohnDoe',
          location: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
          }
        })
      });

      const data = await response.json();
      if (data.success) {
        setIsSOSActive(true); // Only use the context state
        setLocation(location.coords);
        Alert.alert(
          'SOS Activated',
          'Emergency contacts have been notified. Enter the security code sent to them to deactivate SOS mode.'
        );
      } else {
        Alert.alert('Error', data.message || 'Failed to trigger SOS');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to trigger SOS');
    }
  };

  const verifyOTP = async () => {
    try {
      const response = await fetch('http://192.168.80.60:5000/api/sos/verify', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: 'JohnDoe',
          otp: otpInput
        })
      });

      const data = await response.json();
      if (data.success) {
        setIsSOSActive(false); // Only use the context state
        setCountdown(5);
        setOtpInput('');
        Alert.alert('Success', 'SOS mode has been deactivated');
      } else {
        Alert.alert('Invalid Code', data.message || 'Please enter the correct security code');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to verify code');
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF5A5F" />
      <View style={styles.safeArea} />
      
      <View style={styles.contentContainer}>
        {isSOSActive ? (
          <View style={styles.otpContainer}>
            <Text style={styles.alertText}>SOS Mode Active</Text>
            <Text style={styles.otpInstructions}>
              Enter the security code sent to your emergency contacts
            </Text>
            <TextInput
              style={styles.otpInput}
              value={otpInput}
              onChangeText={setOtpInput}
              keyboardType="numeric"
              maxLength={6}
              placeholder="Enter Code"
              placeholderTextColor="rgba(0,0,0,0.5)"
              autoFocus={true}
            />
            <TouchableOpacity 
              style={styles.verifyButton}
              onPress={verifyOTP}
            >
              <Text style={styles.verifyButtonText}>Verify Code</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.logoContainer}>
              <Feather name="feather" size={40} color="white" />
              <Text style={styles.safeText}>I'M SAFE</Text>
            </View>
            
            <Text style={styles.notifyingText}>Notifying your SOS contacts in</Text>
            
            <View style={styles.countdownContainer}>
              <Text style={styles.countdownText}>{countdown}</Text>
            </View>
          </>
        )}
      </View>
      
      {!isSOSActive && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={handleCancel}
          >
            <Text style={styles.cancelText}>Cancel SOS</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.skipButton}
            onPress={handleSkip}
          >
            <Text style={styles.skipText}>Skip Countdown</Text>
          </TouchableOpacity>
        </View>
      )}
      
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
  otpContainer: {
    alignItems: 'center',
    padding: 20,
    width: '100%',
    marginTop: 50,
  },
  otpInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: '80%',
    padding: 15,
    borderRadius: 10,
    fontSize: 24,
    textAlign: 'center',
    letterSpacing: 5,
    marginVertical: 20,
    color: '#000', // Add this to ensure text is visible
  },
  verifyButton: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 20,
  },
  verifyButtonText: {
    color: '#FF5A5F',
    fontSize: 18,
    fontWeight: 'bold',
  },
  alertText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  otpInstructions: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
});

export default SafetyScreen;