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
        tabBarActiveTintColor: '#FF4F93',
        tabBarInactiveTintColor: 'black',
        tabBarLabel: ({ focused, children }) => (
          <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>
            {children}
          </Text>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Track Me',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.tabItem, focused && styles.activeTabItem]}>
              <Ionicons name="location" size={24} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="Recordings"
        options={{
          title: 'Record',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.tabItem, focused && styles.activeTabItem]}>
              <Ionicons name="videocam" size={24} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="Safety"
        options={{
          title: 'Safety',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.tabItem, focused && styles.activeTabItem]}>
              <Ionicons name="shield-checkmark" size={24} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="FakeCall"
        options={{
          title: 'Fake Call',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.tabItem, focused && styles.activeTabItem]}>
              <Ionicons name="call" size={24} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="Help"
        options={{
          title: 'Help',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.tabItem, focused && styles.activeTabItem]}>
              <Ionicons name="help-circle" size={24} color={color} />
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
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingVertical: 10,
    backgroundColor: 'white',
    height: 65,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  activeTabItem: {
    borderBottomWidth: 2,
    borderBottomColor: '#FF4F93',
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 5,
  },
  tabLabelActive: {
    color: '#FF4F93',
  },
});