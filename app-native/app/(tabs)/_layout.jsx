import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#EC4571',
        tabBarInactiveTintColor: 'black',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '',
          tabBarIcon: ({ color }) => (
            <View style={styles.tabItem}>
              <Ionicons name="location" size={26} color="#EC4571"   />
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
              <Ionicons name="videocam" size={26} color="black"   />
              <Text style={styles.tabLabel}>Record</Text>
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
              <Ionicons name="call" size={26} color="black"  />
              <Text style={styles.tabLabel}>Fake Call</Text>
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
              <Ionicons name="help-circle" size={26} color="black"   />
              <Text style={styles.tabLabel}>Help</Text>
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
    height: 70,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
  },
  tabLabel: {
    fontSize: 12,
    color: 'black',
  },
  sosButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FF4259',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  sosText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});