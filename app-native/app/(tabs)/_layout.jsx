import { Tabs } from 'expo-router';
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Alert, Linking, Vibration } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Accelerometer } from 'expo-sensors';

let Contacts;
try {
  Contacts = require('expo-contacts');
} catch (error) {
  console.warn('expo-contacts module not available');
}

const SHAKE_THRESHOLD = 12;
const UPDATE_INTERVAL = 100;

export default function TabLayout() {
  const [friends, setFriends] = useState({ id: '1', name: 'Emergency Contact 1', phone: '9152602555' });
  const lastAcceleration = useRef({ x: 0, y: 0, z: 0 });
  const lastShakeTime = useRef(0);

  useEffect(() => {
    fetchFriends();
    Accelerometer.setUpdateInterval(UPDATE_INTERVAL);

    const subscription = Accelerometer.addListener(detectShake);
    return () => subscription.remove();
  }, []);

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
        fields: [
          Contacts.Fields.PhoneNumbers,
          Contacts.Fields.ContactType,
          Contacts.Fields.Labels,
          Contacts.Fields.Notes
        ],
      });

      const emergencyContacts = data
        .filter(contact => {
          // Filter for contacts that:
          // 1. Have phone numbers
          // 2. Have "emergency" in their notes or labels (case insensitive)
          // 3. Or are marked with a specific label/type that indicates emergency
          return contact.phoneNumbers 
            && contact.phoneNumbers.length > 0 
            && (
              (contact.notes && contact.notes.toLowerCase().includes('emergency'))
              || (contact.contactType && contact.contactType.toLowerCase().includes('emergency'))
              || (contact.labels && contact.labels.some(label => 
                  label.toLowerCase().includes('emergency')
                ))
            );
        })
        .map(contact => ({
          id: contact.id,
          name: contact.name,
          phone: contact.phoneNumbers[0].number,
        }));

      // If no emergency contacts found, use dummy contact
      const contacts = emergencyContacts.length > 0 ? emergencyContacts : [dummyContact];
      setFriends(contacts);
      console.log('Fetched emergency contacts:', contacts);

    } catch (error) {
      console.error('Error fetching emergency contacts:', error);
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
    <Tabs.Screen
      name="MapPage"
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
