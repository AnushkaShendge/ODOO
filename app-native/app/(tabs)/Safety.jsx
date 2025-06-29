import React, { useState, useEffect, useRef } from 'react';
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
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useSOSContext } from '../../context/SOSContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const APP_DIRECTORY = FileSystem.documentDirectory + 'sos/';

const SafetyScreen = () => {
  const { isSOSActive, setIsSOSActive } = useSOSContext();
  const [countdown, setCountdown] = useState(10);
  const [recordTime, setRecordTime] = useState(63);
  const [otpInput, setOtpInput] = useState('');
  const [hasTriggeredSOS, setHasTriggeredSOS] = useState(false);
  const [location, setLocation] = useState(null);
  const [sound, setSound] = useState(null);
  const [isSoundPlaying, setIsSoundPlaying] = useState(false);
  const [recording, setRecording] = useState(null);
  const [photoUri, setPhotoUri] = useState(null);
  const [audioUri, setAudioUri] = useState(null);
  const [isMounted, setIsMounted] = useState(true); // New state to track mounting

  const cameraRef = useRef(null);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const router = useRouter();

  const playEmergencySound = async () => {
    if (!isMounted) return;
    try {
      if (sound) {
        await sound.unloadAsync();
      }

      const newSound = new Audio.Sound();
      await newSound.loadAsync(require('../../assets/alert.mp3'));
      await newSound.setVolumeAsync(1.0);
      await newSound.setIsLoopingAsync(true);
      
      await Audio.setAudioModeAsync({
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        allowsRecordingIOS: false,
        playThroughEarpieceAndroid: false,
        shouldDuckAndroid: false,
      });

      setSound(newSound);
      if (isMounted) {
        await newSound.playAsync();
        setIsSoundPlaying(true);
      }
    } catch (error) {
      console.error('Error playing emergency sound:', error);
      if (isMounted) {
        Alert.alert('Error', 'Failed to play emergency sound');
      }
    }
  };

  const stopSound = async () => {
    try {
      if (sound && isSoundPlaying) {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
        setIsSoundPlaying(false);
      }
    } catch (error) {
      console.error('Error stopping sound:', error);
    }
  };

  useEffect(() => {

    if (sosJustDeactivated) {
      return;
    }

    const setupDirectory = async () => {
      try {
        const dirInfo = await FileSystem.getInfoAsync(APP_DIRECTORY);
        if (!dirInfo.exists) {
          await FileSystem.makeDirectoryAsync(APP_DIRECTORY, { intermediates: true });
        }
      } catch (error) {
        console.error('Error setting up directory:', error);
      }
    };
    
    setupDirectory();
    
    const initializeCamera = async () => {
      if (!cameraPermission?.granted) {
        await requestCameraPermission();
      }
    };
    
    initializeCamera();
    getLocation();
    
    return () => {
      setIsMounted(false);
      stopSound();
      if (recording) {
        stopRecording(false);
      }
    };
  }, [cameraPermission, recording]);

  useEffect(() => {
    if (cameraPermission?.granted && cameraRef.current && isMounted) {
      const captureInitialData = async () => {
        try {
          const photoUri = await takePhoto();
          await startRecording();
        } catch (error) {
          console.error('Error in initial data capture:', error);
        }
      };
      captureInitialData();
    }
  }, [cameraPermission?.granted, isMounted]);

  useEffect(() => {
    if (countdown === 0 && !isSOSActive && !hasTriggeredSOS && isMounted) {
      stopRecording(true);
      setHasTriggeredSOS(true);
      setIsSOSActive(true);
      playEmergencySound();
    }
  }, [countdown, isSOSActive, hasTriggeredSOS, isMounted]);

  useEffect(() => {
    if (!isMounted) return;

    if (countdown > 0 && !isSOSActive && !hasTriggeredSOS) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isSOSActive) {
      setCountdown(0);
      setHasTriggeredSOS(true);
      stopSound();
    }
  }, [countdown, isSOSActive, hasTriggeredSOS, isMounted]);

  useEffect(() => {
    if (isSOSActive && isMounted) {
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
  }, [isSOSActive, isMounted]);

  const getLocation = async () => {
    if (!isMounted) return;
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const locationData = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High
        });
        if (isMounted) setLocation(locationData);
      }
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const takePhoto = async () => {
    if (!cameraRef.current || !isMounted) return null;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.3,
        skipProcessing: true,
        width: 640,
        height: 480
      });
      if (isMounted) setPhotoUri(photo.uri);
      return photo.uri;
    } catch (error) {
      console.error('Error taking photo:', error);
      return null;
    }
  };

  const startRecording = async () => {
    if (!isMounted) return;
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        if (isMounted) alert('Audio permission is required for SOS');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      
      const { recording: audioRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      if (isMounted) setRecording(audioRecording);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = async (sendToBackend = true) => {
    if (!recording || !isMounted) return;

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      if (isMounted) setAudioUri(uri);
      
      if (sendToBackend && isMounted) {
        await sendSOSData(uri, photoUri);
      }
      
      if (isMounted) setRecording(null);
    } catch (error) {
      console.error('Error stopping recording:', error);
    } finally {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });
    }
  };

  const sendSOSData = async (audioUri, photoUri) => {
    if (!isMounted) return;
    try {
      const userStr = await AsyncStorage.getItem('userData');
      const user = JSON.parse(userStr);
      const recordingId = Date.now().toString();
      const recordingDir = `${APP_DIRECTORY}${recordingId}/`;
      await FileSystem.makeDirectoryAsync(recordingDir, { intermediates: true });

      const newAudioUri = `${recordingDir}sos-recording-${recordingId}.m4a`;
      const newPhotoUri = photoUri ? `${recordingDir}sos-photo-${recordingId}.jpg` : null;

      await FileSystem.moveAsync({
        from: audioUri,
        to: newAudioUri
      });

      if (photoUri) {
        await FileSystem.moveAsync({
          from: photoUri,
          to: newPhotoUri
        });
      }

      const formData = new FormData();
      formData.append('userName', user.name);
      
      if (location) {
        formData.append('location', JSON.stringify({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        }));
      }
      
      formData.append('recording', {
        uri: newAudioUri,
        type: 'audio/m4a',
        name: `sos-recording-${recordingId}.m4a`
      });

      if (newPhotoUri) {
        formData.append('photo', {
          uri: newPhotoUri,
          type: 'image/jpeg',
          name: `sos-photo-${recordingId}.jpg`
        });
      }

      const response = await fetch('https://normal-joint-hamster.ngrok-free.app/api/sos/trigger', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      let data = contentType && contentType.includes("application/json") 
        ? await response.json() 
        : { success: response.ok, message: await response.text() };

      if (!data.success) {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error sending SOS data:', error);
      if (isMounted) {
        Alert.alert(
          'Error',
          'Failed to send SOS data. Please check your internet connection.'
        );
      }
    }
  };

  const verifyOTP = async () => {
    if (!isMounted) return;
    try {
      const userStr = await AsyncStorage.getItem('userData');
      const user = JSON.parse(userStr);
      const response = await fetch('https://normal-joint-hamster.ngrok-free.app/api/sos/verify', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: user.name,
          otp: otpInput
        })
      });

      const data = await response.json();
      if (data.success && isMounted) {
        await stopSound();
        setIsSOSActive(false);
        setCountdown(10);
        setOtpInput('');
        setHasTriggeredSOS(false);
        
        Alert.alert(
          'Success',
          'SOS mode has been deactivated successfully.',
          [{
            text: 'OK',
            onPress: async () => {
              await stopSound();
              setIsMounted(false); // Set to false before navigation
              router.push('/FakeCall');
            }
          }]
        );
      } else if (isMounted) {
        Alert.alert('Invalid Code', data.message || 'Please enter the correct security code');
      }
    } catch (error) {
      console.error(error);
      if (isMounted) {
        Alert.alert('Error', 'Failed to verify code');
      }
    }
  };

  const handleCancel = async () => {
    if (!isSOSActive && isMounted) {
      await stopRecording(false);
      await stopSound();
      setCountdown(10);
      setHasTriggeredSOS(false);
      takePhoto().then(() => startRecording());
    }
  };

  const handleSkip = async () => {
    if (!isSOSActive && isMounted) {
      setCountdown(0);
      await stopSound();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!cameraPermission) {
    return <View style={styles.container} />;
  }

  if (!cameraPermission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>
          We need camera permission for SOS features
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestCameraPermission}
        >
          <Text style={styles.permissionButtonText}>
            Grant Camera Permission
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF5A5F" />
      <View style={styles.safeArea} />
      
      <CameraView
        style={styles.camera}
        facing="front"
        ref={cameraRef}
      />
      
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
    color: '#000',
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
  camera: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 1,
    height: 1,
    opacity: 0,
    zIndex: -1,
  },
  permissionText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 100,
    marginHorizontal: 20,
  },
  permissionButton: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 30,
    alignSelf: 'center',
  },
  permissionButtonText: {
    color: '#FF5A5F',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SafetyScreen;