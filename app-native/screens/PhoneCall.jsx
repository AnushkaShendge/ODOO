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
  MaterialIcons, 
  Ionicons, 
  Feather, 
  FontAwesome 
} from '@expo/vector-icons';

const PhoneCallScreen = () => {
  const [callTime, setCallTime] = useState(0);
  
  // Timer effect for call duration
  useEffect(() => {
    const timer = setInterval(() => {
      setCallTime(prevTime => prevTime + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Format seconds to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Top section with status icons */}
      <View style={styles.statusBar}>
        <Text style={styles.timeText}>1:37</Text>
        <View style={styles.iconRow}>
          <FontAwesome name="comment" size={16} color="white" style={styles.statusIcon} />
          <Ionicons name="sync" size={16} color="white" style={styles.statusIcon} />
          <Ionicons name="notifications" size={16} color="white" style={styles.statusIcon} />
          <Ionicons name="bulb-outline" size={16} color="white" style={styles.statusIcon} />
          <Feather name="more-horizontal" size={16} color="white" style={styles.statusIcon} />
        </View>
        <View style={styles.batteryRow}>
          <Ionicons name="battery-full" size={16} color="white" style={styles.statusIcon} />
          <Feather name="phone" size={14} color="white" style={styles.statusIcon} />
          <Ionicons name="wifi" size={16} color="white" style={styles.statusIcon} />
          <Ionicons name="cellular" size={16} color="white" style={styles.statusIcon} />
        </View>
      </View>
      
      {/* Caller info */}
      <View style={styles.callerContainer}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Feather name="user" size={40} color="#003366" />
          </View>
        </View>
        
        <Text style={styles.callerName}>vinayak</Text>
        <Text style={styles.callerNumber}>9930679651</Text>
        <Text style={styles.callTimer}>{formatTime(callTime)}</Text>
      </View>
      
      {/* Call actions */}
      <View style={styles.actionsContainer}>
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="person" size={24} color="white" />
            <Text style={styles.actionText}>Record</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Feather name="video" size={24} color="white" />
            <Text style={styles.actionText}>Video</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Feather name="plus" size={24} color="white" />
            <Text style={styles.actionText}>Add call</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="volume-high" size={24} color="white" />
            <Text style={styles.actionText}>Speaker</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Feather name="grid" size={24} color="white" />
            <Text style={styles.actionText}>Dialpad</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Feather name="mic-off" size={24} color="white" />
            <Text style={styles.actionText}>Mute</Text>
          </TouchableOpacity>
        </View>
        
        {/* End call button */}
        <View style={styles.endCallContainer}>
          <TouchableOpacity style={styles.endCallButton}>
            <Feather name="phone" size={32} color="white" />
          </TouchableOpacity>
        </View>
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
    backgroundColor: '#000000',
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 5,
  },
  timeText: {
    color: 'white',
    fontWeight: 'bold',
  },
  iconRow: {
    flexDirection: 'row',
  },
  batteryRow: {
    flexDirection: 'row',
  },
  statusIcon: {
    marginHorizontal: 4,
  },
  callerContainer: {
    flex: 0.4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  callerName: {
    color: 'white',
    fontSize: 32,
    marginBottom: 10,
  },
  callerNumber: {
    color: 'white',
    fontSize: 18,
    marginBottom: 15,
  },
  callTimer: {
    color: 'white',
    fontSize: 18,
  },
  actionsContainer: {
    flex: 0.6,
    paddingHorizontal: 20,
    justifyContent: 'flex-end',
    paddingBottom: 40,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  actionButton: {
    alignItems: 'center',
    width: 80,
  },
  actionText: {
    color: 'white',
    marginTop: 8,
    fontSize: 14,
  },
  endCallContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  endCallButton: {
    backgroundColor: '#FF3B30',
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
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

export default PhoneCallScreen;