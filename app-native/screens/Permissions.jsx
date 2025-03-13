import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar, 
  SafeAreaView, 
  ScrollView
} from 'react-native';
import { 
  Ionicons, 
  MaterialIcons,
  MaterialCommunityIcons,
  Feather
} from '@expo/vector-icons';

const PermissionsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      
      {/* Top section with status icons */}
      <View style={styles.statusBar}>
        <Text style={styles.timeText}>2:07</Text>
        
        <View style={styles.statusIcons}>
          <Feather name="clipboard" size={16} color="#555" style={styles.statusIcon} />
          <MaterialCommunityIcons name="sync" size={16} color="#555" style={styles.statusIcon} />
          <MaterialCommunityIcons name="snapchat" size={16} color="#555" style={styles.statusIcon} />
          <MaterialCommunityIcons name="snapchat" size={16} color="#555" style={styles.statusIcon} />
          <Feather name="more-horizontal" size={16} color="#555" style={styles.statusIcon} />
        </View>
        
        <View style={styles.rightStatusIcons}>
          <Ionicons name="bluetooth" size={16} color="#555" style={styles.statusIcon} />
          <MaterialCommunityIcons name="bluetooth-audio" size={16} color="#555" style={styles.statusIcon} />
          <Ionicons name="wifi" size={16} color="#555" style={styles.statusIcon} />
          <MaterialIcons name="signal-cellular-alt" size={16} color="#555" style={styles.statusIcon} />
          <View style={styles.batteryContainer}>
            <Text style={styles.batteryText}>45%</Text>
            <Ionicons name="battery-half" size={16} color="#555" style={styles.statusIcon} />
          </View>
        </View>
      </View>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Access required</Text>
      </View>
      
      <ScrollView style={styles.content}>
        {/* GPS Location */}
        <View style={styles.permissionItem}>
          <View style={styles.iconContainer}>
            <Ionicons name="map" size={24} color="#FF4D8D" />
          </View>
          <View style={styles.permissionTextContainer}>
            <Text style={styles.permissionTitle}>GPS Location</Text>
            <Text style={styles.permissionDescription}>
              Access to GPS and location permission is essential to locate you during emergency situations while using SOS.
            </Text>
            <Text style={styles.permissionDescription}>
              Allowing location access to "allow all the time" lets the user be tracked even when the app's screen is closed.
            </Text>
            <Text style={styles.permissionNote}>
              Note: To enable location settings to "allow all the time", from location settings click {'>'} App access to location {'>'} I'm Safe app {'>'} Allow all the time.
            </Text>
          </View>
        </View>
        
        {/* Microphone And Camera */}
        <View style={styles.permissionItem}>
          <View style={styles.iconContainer}>
            <View style={styles.cameraGroup}>
              <Ionicons name="mic" size={24} color="#FF4D8D" />
              <Ionicons name="camera" size={20} color="#FF4D8D" style={styles.cameraIcon} />
            </View>
          </View>
          <View style={styles.permissionTextContainer}>
            <Text style={styles.permissionTitle}>Microphone And Camera</Text>
            <Text style={styles.permissionDescription}>
              Access to microphone and camera is essential to document your emergency situations while using SOS.
            </Text>
          </View>
        </View>
        
        {/* Battery Optimisation */}
        <View style={styles.permissionItem}>
          <View style={styles.iconContainer}>
            <Ionicons name="battery-charging" size={24} color="#FF4D8D" />
          </View>
          <View style={styles.permissionTextContainer}>
            <Text style={styles.permissionTitle}>Battery Optimisation</Text>
            <Text style={styles.permissionDescription}>
              To ensure that app works properly and delivers timely notifications, it's recommended that you disable battery optimization for our app. Battery optimization can sometimes cause delays or missed notifications.
            </Text>
            <Text style={styles.permissionNote}>
              Note: Go to 'Settings' on your device {'>'} Tap on 'Battery' or 'Battery optimization' (depending on your device) {'>'} Select 'I'm Safe App' {'>'} Select 'Don't optimize' or 'Don't optimize battery usage' or 'No restrictions' (depending on your device).
            </Text>
          </View>
        </View>
        
        {/* Nearby devices */}
        <View style={styles.permissionItem}>
          <View style={styles.iconContainer}>
            <Ionicons name="map" size={24} color="#FF4D8D" />
          </View>
          <View style={styles.permissionTextContainer}>
            <Text style={styles.permissionTitle}>Nearby devices</Text>
            <Text style={styles.permissionDescription}>
              Nearby Devices permission is required to discover and interact with nearby devices using Bluetooth
            </Text>
          </View>
        </View>
        
        {/* Continue Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.continueButton}>
            <Text style={styles.continueText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
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
    backgroundColor: 'white',
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
    color: '#333',
    fontWeight: 'bold',
    fontSize: 16,
  },
  statusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightStatusIcons: {
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
    color: '#555',
    fontSize: 12,
    marginRight: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    marginRight: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  permissionItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  iconContainer: {
    width: 40,
    alignItems: 'center',
    marginRight: 10,
  },
  cameraGroup: {
    position: 'relative',
  },
  cameraIcon: {
    position: 'absolute',
    right: -10,
    bottom: -5,
  },
  permissionTextContainer: {
    flex: 1,
  },
  permissionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#222',
  },
  permissionDescription: {
    fontSize: 16,
    color: '#444',
    marginBottom: 8,
  },
  permissionNote: {
    fontSize: 16,
    color: '#888',
    marginBottom: 8,
  },
  buttonContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 20,
  },
  continueButton: {
    backgroundColor: '#5D1049',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 25,
    width: '80%',
    alignItems: 'center',
  },
  continueText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  homeIndicator: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  homeIndicatorBar: {
    width: 134,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 3,
  },
});

export default PermissionsScreen;
