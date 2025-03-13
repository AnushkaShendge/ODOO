import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar,
  TextInput
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const FakeCallScreen = () => {
  const [callerDetails, setCallerDetails] = useState('');
  const [showWarning, setShowWarning] = useState(true);
  
  return (
    <View style={styles.container}>
      {/* Status Bar */}
      <View style={styles.statusBar}>
        <Text style={styles.timeText}>02:03</Text>
        <FontAwesome name="whatsapp" size={20} color="black" />
        <View style={styles.statusBarRight}>
          <Text style={styles.kbpsText}>22.0 KB/S</Text>
          <Ionicons name="wifi" size={20} color="black" />
          <Ionicons name="call-outline" size={18} color="black" />
          <Icon name="signal-cellular-alt" size={18} color="black" />
          <FontAwesome name="battery-full" size={20} color="black" />
          <Text style={styles.batteryText}>100%</Text>
        </View>
      </View>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logo}>
          <Icon name="favorite" size={30} color="#FF4F93" />
          <Text style={styles.logoText}>I'M SAFE</Text>
        </View>
        <View style={styles.headerIcons}>
          <Ionicons name="notifications-outline" size={24} color="black" />
          <Icon name="menu" size={30} color="black" style={styles.menuIcon} />
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Fake Call</Text>
        <Text style={styles.subtitle}>
          Place a fake phone call and pretend you are talking to someone.
        </Text>
        
        {/* Caller Details */}
        <View style={styles.callerDetailsContainer}>
          <View style={styles.callerDetailsContent}>
            <Text style={styles.callerDetailsTitle}>Caller Details</Text>
            <TextInput
              style={styles.callerDetailsInput}
              placeholder="Set caller details"
              value={callerDetails}
              onChangeText={setCallerDetails}
            />
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Icon name="edit" size={20} color="black" />
          </TouchableOpacity>
        </View>
        
        {/* Warning Popup */}
        {showWarning && (
          <View style={styles.warningContainer}>
            <View style={styles.warningIcon}>
              <Icon name="warning" size={24} color="#FFB700" />
            </View>
            <View style={styles.warningContent}>
              <Text style={styles.warningTitle}>Warning!</Text>
              <Text style={styles.warningText}>
                Add atleast one friend as SOS contact to start SOS
              </Text>
            </View>
          </View>
        )}
        
        {/* Call Button */}
        <TouchableOpacity style={styles.callButton}>
          <Text style={styles.callButtonText}>Start Call</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  statusBar: {
    height: 25,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  timeText: {
    marginRight: 10,
  },
  statusBarRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  kbpsText: {
    marginRight: 5,
    fontSize: 12,
  },
  batteryText: {
    marginLeft: 2,
    fontSize: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    color: '#FF4F93',
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginLeft: 15,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    marginBottom: 30,
  },
  callerDetailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  callerDetailsContent: {
    flex: 1,
  },
  callerDetailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  callerDetailsInput: {
    fontSize: 16,
    color: '#888',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  warningContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 5,
    borderLeftColor: '#FFB700',
  },
  warningIcon: {
    marginRight: 15,
    justifyContent: 'center',
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  warningText: {
    fontSize: 16,
    color: '#444',
  },
  callButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 20,
  },
  callButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default FakeCallScreen;
