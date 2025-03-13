import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, StatusBar, SafeAreaView } from 'react-native';
import { MaterialIcons, Ionicons, Feather, FontAwesome } from '@expo/vector-icons';

const FriendsScreen = () => {
  const [activeTab, setActiveTab] = useState('myFriends');
  
  const friends = [
    {
      id: '1',
      name: 'Anushka Shendge',
      phone: '7977409706',
      isSosContact: true
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Friends</Text>
      </View>
      
      {/* Subtitle */}
      <Text style={styles.subtitle}>
        Onboard friends and make them your SOS contact.
      </Text>
      
      <View style={styles.divider} />
      
      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'myFriends' && styles.activeTab]} 
          onPress={() => setActiveTab('myFriends')}
        >
          <Text style={[styles.tabText, activeTab === 'myFriends' && styles.activeTabText]}>My Friends</Text>
          {activeTab === 'myFriends' && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'requests' && styles.activeTab]} 
          onPress={() => setActiveTab('requests')}
        >
          <Text style={[styles.tabText, activeTab === 'requests' && styles.activeTabText]}>Requests</Text>
          {activeTab === 'requests' && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>
      </View>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <MaterialIcons name="search" size={24} color="#666" style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput} 
            placeholder="Type to search" 
            placeholderTextColor="#999"
          />
        </View>
        <TouchableOpacity style={styles.infoButton}>
          <Ionicons name="information-circle-outline" size={24} color="#555" />
        </TouchableOpacity>
      </View>
      
      {/* Friends List */}
      <ScrollView style={styles.friendsList}>
        {activeTab === 'myFriends' && friends.map(friend => (
          <View key={friend.id} style={styles.friendItem}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <FontAwesome name="user" size={32} color="#f8d0d8" />
              </View>
            </View>
            
            <View style={styles.friendInfo}>
              <Text style={styles.friendName}>{friend.name}</Text>
              <Text style={styles.friendPhone}>{friend.phone}</Text>
              {friend.isSosContact && (
                <View style={styles.sosTagContainer}>
                  <Text style={styles.sosTagText}>SOS Contact</Text>
                </View>
              )}
            </View>
            
            <TouchableOpacity style={styles.moreButton}>
              <MaterialIcons name="more-vert" size={24} color="#555" />
            </TouchableOpacity>
          </View>
        ))}
        
        {activeTab === 'requests' && (
          <View style={styles.emptyRequestsContainer}>
            <Text style={styles.emptyText}>No pending requests</Text>
          </View>
        )}
      </ScrollView>
      
      {/* Add Button */}
      <TouchableOpacity style={styles.addButton}>
        <Ionicons name="add" size={32} color="#555" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 15,
    flex: 1,
    textAlign: 'center',
    paddingRight: 40,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    paddingHorizontal: 40,
    marginVertical: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginTop: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    position: 'relative',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#ff4081',
  },
  tabText: {
    fontSize: 16,
    color: '#888',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#ff4081',
    fontWeight: '600',
  },
  activeTabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#ff4081',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  infoButton: {
    marginLeft: 12,
    padding: 4,
  },
  friendsList: {
    flex: 1,
  },
  friendItem: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fceff1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#222',
    marginBottom: 4,
  },
  friendPhone: {
    fontSize: 16,
    color: '#666',
    marginBottom: 6,
  },
  sosTagContainer: {
    backgroundColor: '#fceff1',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
    alignSelf: 'flex-start',
  },
  sosTagText: {
    color: '#ff4081',
    fontSize: 14,
    fontWeight: '500',
  },
  moreButton: {
    padding: 8,
  },
  emptyRequestsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
  addButton: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0dde3',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});

export default FriendsScreen;