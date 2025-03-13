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