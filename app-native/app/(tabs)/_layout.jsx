import { Tabs } from 'expo-router';
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Alert, Linking, Vibration, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Accelerometer } from 'expo-sensors';
import { useNavigation } from '@react-navigation/native';
import { useSOSContext } from '../../context/SOSContext';
let Contacts;
try {
  Contacts = require('expo-contacts');
} catch (error) {
  console.warn('expo-contacts module not available');
}

const SHAKE_THRESHOLD = 12;
const UPDATE_INTERVAL = 100;

export default function TabLayout() {
  const [friends, setFriends] = useState([{
    "id":"2",
    "name":"anushka",
    "phone":"7977409706"
  }]);
  const lastAcceleration = useRef({ x: 0, y: 0, z: 0 });
  const lastShakeTime = useRef(0);
  const {isSOSActive, setIsSOSActive} = useSOSContext();
  const navigation = useNavigation();

  useEffect(() => {
    fetchFriends();
    Accelerometer.setUpdateInterval(UPDATE_INTERVAL);

    const subscription = Accelerometer.addListener(detectShake);
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (isSOSActive) {
        // Prevent leaving the screen
        e.preventDefault();
        Alert.alert(
          'SOS Active',
          'Please enter security code to deactivate SOS mode',
          [{ text: 'OK' }]
        );
      }
    });

    return unsubscribe;
  }, [isSOSActive, navigation]);

  const fetchFriends = async () => {
    try {
      const dummyContact = { id: '1', name: 'Emergency Contact 1', phone: '9152602555' };

      if (!Contacts) {
        console.warn('Contacts module not available');
        setFriends([dummyContact]);
        return;
      }

      const { status } = await Contacts.requestPermissionsAsync();
      if (status !== 'granted') {
        setFriends([dummyContact]);
        Alert.alert('Permission Denied', 'Cannot access contacts');
        return;
      }

      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers],
      });

      const realContacts = data
        .filter(contact => contact.phoneNumbers && contact.phoneNumbers.length > 0)
        .map(contact => ({
          id: contact.id,
          name: contact.name,
          phone: contact.phoneNumbers[0].number,
        }));

      // Ensure at least the dummy contact is present
      setFriends([dummyContact, ...realContacts]);
      console.log('Fetched contacts:', [dummyContact, ...realContacts]);

    } catch (error) {
      console.error('Error fetching contacts:', error);
      setFriends([{ id: '1', name: 'Emergency Contact 1', phone: '9152602555' }]);
    }
  };

  const callEmergencyContacts = () => {
    console.log('Emergency Contacts:', friends);

    if (friends.length === 0 || !friends[0].phone) {
      Alert.alert('No emergency contacts', 'Please add emergency contacts in your profile');
      return;
    }

    Vibration.vibrate(500);
    Alert.alert(
      'Emergency Alert',
      `Calling ${friends[0].name}...`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, Call Now',
          onPress: () => {
            const phoneNumber = friends[0].phone;
            Linking.openURL(`tel:${phoneNumber}`);
          },
        },
      ],
      { cancelable: true }
    );
  };

  const detectShake = ({ x, y, z }) => {
    const now = Date.now();
    const prev = lastAcceleration.current;

    const deltaX = Math.abs(x - prev.x);
    const deltaY = Math.abs(y - prev.y);
    const deltaZ = Math.abs(z - prev.z);

    const accelerationChange = deltaX + deltaY + deltaZ;

    if (now - lastShakeTime.current > 1000 && accelerationChange > SHAKE_THRESHOLD) {
      lastShakeTime.current = now;
      callEmergencyContacts();
    }

    lastAcceleration.current = { x, y, z };
  };

  
return (
  <Tabs
    screenOptions={{
      headerShown: false,
      tabBarStyle: styles.tabBar,
      tabBarActiveTintColor: '#EC4571',
      tabBarInactiveTintColor: 'black',
      tabBarItemStyle: {
        paddingVertical: 5,
      },
      // Disable tab press when SOS is active
      tabBarButton: (props) => (
        <TouchableOpacity
          {...props}
          disabled={isSOSActive}
          style={[
            props.style,
            isSOSActive && { opacity: 0.5 }
          ]}
        />
      ),
    }}
  >
    <Tabs.Screen
      name="index"
      options={{
        title: '',
        tabBarIcon: ({ color }) => (
          <View style={styles.tabItem}>
            <Ionicons name="location" size={24} color="#EC4571" />
            <Text style={styles.tabLabel}>Track Me</Text>
          </View>
        ),
      }}
    />
    <Tabs.Screen
      name="Recordings"
      options={{
        title: '',
        tabBarIcon: ({ color }) => (
          <View style={styles.tabItem}>
            <Ionicons name="videocam" size={24} color="black" />
            <Text style={styles.tabLabel} >Record</Text>
          </View>
        ),
      }}
    />
    <Tabs.Screen
      name="Safety"
      options={{
        title: '',
        tabBarIcon: () => (
          <View style={styles.sosButton}>
            <Text style={styles.sosText}>SOS</Text>
          </View>
        ),
      }}
    />
    <Tabs.Screen
      name="FakeCall"
      options={{
        title: '',
        tabBarIcon: ({ color }) => (
          <View style={styles.tabItem}>
            <Ionicons name="call" size={24} color="black" />
            <Text style={styles.tabLabel} >Fake Call</Text>
          </View>
        ),
      }}
    />
    <Tabs.Screen
      name="Help"
      options={{
        title: '',
        tabBarIcon: ({ color }) => (
          <View style={styles.tabItem}>
            <Ionicons name="help-circle" size={24} color="black" />
            <Text style={styles.tabLabel} >Help</Text>
          </View>
        ),
      }}
    />
    
  </Tabs>
);
}

const styles = StyleSheet.create({
tabBar: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
  borderTopWidth: 1,
  borderTopColor: '#f0f0f0',
  backgroundColor: 'white',
  height: 75,
  paddingBottom: 20,
  paddingTop: 2,
},
tabItem: {
  alignItems: 'center',
  justifyContent: 'center',
  paddingTop: 5,
  height: 60,
},
tabLabel: {
  fontSize: 12,
  color: 'black',
  marginTop: 1,
},
sosButton: {
  width: 55,
  height: 55,
  borderRadius: 27.5,
  backgroundColor: '#FF4259',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 15,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
},
sosText: {
  color: 'white',
  fontWeight: 'bold',
  fontSize: 16,
},
});


