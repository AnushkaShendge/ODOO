import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  StatusBar, 
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const SelectFriendsScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('always');
  
  // Sample contacts data
  const contacts = [
    { id: '1', name: 'Anushka Shendge', selected: false },
    // Add more contacts as needed
  ];
  
  const renderContact = ({ item }) => (
    <TouchableOpacity style={styles.contactItem}>
      <View style={styles.contactAvatar}>
        <Icon name="person" size={30} color="#F8A5C2" />
      </View>
      <Text style={styles.contactName}>{item.name}</Text>
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FCF2F4" barStyle="dark-content" />
      
      {/* Status Bar */}
      <View style={styles.statusBar}>
        <Text style={styles.timeText}>3:03</Text>
        <View style={styles.statusBarIcons}>
          <Icon name="videocam" size={18} color="#333" />
          <FontAwesome name="whatsapp" size={18} color="#333" style={styles.statusIcon} />
          <Ionicons name="flash" size={18} color="#333" style={styles.statusIcon} />
          <FontAwesome name="snapchat-ghost" size={18} color="#333" style={styles.statusIcon} />
          <MaterialCommunityIcons name="dots-horizontal" size={18} color="#333" style={styles.statusIcon} />
        </View>
        <View style={styles.statusBarRight}>
          <Ionicons name="bluetooth" size={16} color="#333" />
          <Ionicons name="location-outline" size={16} color="#333" style={styles.statusIcon} />
          <Ionicons name="volume-mute" size={16} color="#333" style={styles.statusIcon} />
          <Ionicons name="wifi" size={16} color="#333" style={styles.statusIcon} />
          <Icon name="signal-cellular-alt" size={16} color="#333" style={styles.statusIcon} />
          <View style={styles.batteryStatus}>
            <Text style={styles.batteryText}>33%</Text>
            <Icon name="battery-3-bar" size={18} color="#333" />
          </View>
        </View>
      </View>
      
      {/* Handle at top */}
      <View style={styles.handleContainer}>
        <View style={styles.handle} />
      </View>
      
      {/* Title */}
      <Text style={styles.title}>Select friends & share your live location</Text>
      <Text style={styles.subtitle}>Tap to select</Text>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={24} color="#4E1158" />
        <TextInput
          style={styles.searchInput}
          placeholder="Type to search"
          placeholderTextColor="#888"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
      
      {/* All Contacts Section */}
      <Text style={styles.sectionTitle}>All contacts</Text>
      
      {/* Contacts List */}
      <FlatList
        data={contacts}
        renderItem={renderContact}
        keyExtractor={item => item.id}
        style={styles.contactsList}
      />
      
      {/* Duration Section */}
      <View style={styles.durationSection}>
        <Text style={styles.durationTitle}>Live location duration</Text>
        
        <View style={styles.durationOptions}>
          <TouchableOpacity 
            style={styles.durationOption} 
            onPress={() => setSelectedDuration('always')}
          >
            <View style={[
              styles.radioOuter, 
              selectedDuration === 'always' && styles.radioOuterSelected
            ]}>
              {selectedDuration === 'always' && <View style={styles.radioInner} />}
            </View>
            <Text style={styles.durationText}>Always</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.durationOption} 
            onPress={() => setSelectedDuration('1hour')}
          >
            <View style={[
              styles.radioOuter, 
              selectedDuration === '1hour' && styles.radioOuterSelected
            ]}>
              {selectedDuration === '1hour' && <View style={styles.radioInner} />}
            </View>
            <Text style={styles.durationText}>1 Hour</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.durationOption} 
            onPress={() => setSelectedDuration('8hour')}
          >
            <View style={[
              styles.radioOuter, 
              selectedDuration === '8hour' && styles.radioOuterSelected
            ]}>
              {selectedDuration === '8hour' && <View style={styles.radioInner} />}
            </View>
            <Text style={styles.durationText}>8 Hour</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Continue Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.continueButton}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
      
      {/* Bottom Handle */}
      <View style={styles.bottomHandleContainer}>
        <View style={styles.bottomHandle} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCF2F4',
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingTop: 5,
    paddingBottom: 10,
  },
  timeText: {
    fontWeight: 'bold',
  },
  statusBarIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    marginLeft: 8,
  },
  statusBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  batteryStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  batteryText: {
    fontSize: 12,
    marginRight: 2,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  handle: {
    width: 60,
    height: 4,
    backgroundColor: '#DDD',
    borderRadius: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 40,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 30,
    paddingHorizontal: 15,
    marginHorizontal: 20,
    marginVertical: 10,
    height: 50,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    color: '#666',
    paddingHorizontal: 20,
    marginTop: 15,
    marginBottom: 10,
  },
  contactsList: {
    flex: 1,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  contactAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FCE2EC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  contactName: {
    fontSize: 16,
    color: '#333',
  },
  durationSection: {
    marginTop: 10,
    paddingHorizontal: 20,
  },
  durationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  durationOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  durationOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#888',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  radioOuterSelected: {
    borderColor: '#FF4F93',
    backgroundColor: '#FF4F93',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'white',
  },
  durationText: {
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  continueButton: {
    backgroundColor: '#4E1158',
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 40,
    width: '80%',
    alignItems: 'center',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomHandleContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  bottomHandle: {
    width: 60,
    height: 4,
    backgroundColor: '#DDD',
    borderRadius: 2,
  },
});

export default SelectFriendsScreen;