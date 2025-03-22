import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import { useSocket } from '../components/SocketContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Add this import

const UsersScreen = () => {
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const url = "https://normal-joint-hamster.ngrok-free.app";
  const { socket, userName } = useSocket();

  // All the existing useEffect and functions remain the same...

  // Profile Image component with icon fallback
  const ProfileImage = ({ uri, size, style }) => {
    const imageSize = size || 60;
    const iconSize = imageSize * 0.6;
    
    return uri ? (
      <Image
        source={{ uri }}
        style={[{ width: imageSize, height: imageSize, borderRadius: imageSize / 2 }, style]}
      />
    ) : (
      <View style={[
        styles.profileIconContainer, 
        { width: imageSize, height: imageSize, borderRadius: imageSize / 2 },
        style
      ]}>
        <Icon name="account" size={iconSize} color="#fff" />
      </View>
    );
  };

  const renderUserItem = ({ item }) => {
    // Check if this user has a pending request in our list
    const hasPendingRequest = pendingRequests.some(
      req => req.sender === item._id && req.status === 'pending'
    );
    
    // Button logic remains the same...
    let buttonText = 'Add Friend';
    let buttonStyle = styles.addButton;
    let onPress = () => sendFriendRequest(item.name);
    let disabled = false;

    if (hasPendingRequest) {
      buttonText = 'Respond';
      buttonStyle = styles.respondButton;
      onPress = navigateToFriendRequests;
    } else {
      switch(item.friendshipStatus) {
        case 'pending':
          buttonText = 'Request Sent';
          buttonStyle = styles.pendingButton;
          disabled = true;
          break;
        case 'incoming':
          buttonText = 'Respond';
          buttonStyle = styles.respondButton;
          onPress = navigateToFriendRequests;
          break;
      }
    }

    return (
      <View style={styles.card}>
        <ProfileImage uri={item.profilePicture} size={60} />
        <View style={styles.cardContent}>
          <Text style={styles.name}>{item.name}</Text>
          {item.mutualFriends > 0 && (
            <Text style={styles.mutualFriends}>{item.mutualFriends} mutual friends</Text>
          )}
          <TouchableOpacity
            style={[styles.button, buttonStyle]}
            onPress={onPress}
            disabled={disabled}
          >
            <Text style={styles.buttonText}>{buttonText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderPendingRequest = (request) => (
    <View key={request._id} style={styles.requestCard}>
      <ProfileImage uri={request.sender?.profilePicture} size={50} />
      <View style={styles.requestContent}>
        <Text style={styles.name}>{request.sender}</Text>
        <TouchableOpacity
          style={[styles.button, styles.acceptButton]}
          onPress={() => acceptFriendRequest(request._id)}
        >
          <Text style={styles.buttonText}>Accept</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFriend = (friend) => (
    <View key={friend._id} style={styles.friendCard}>
      <ProfileImage uri={friend.profilePicture} size={70} />
      <Text style={styles.friendName} numberOfLines={1}>
        {friend.name}
      </Text>
    </View>
  );

  // Return statements for loading and error remain the same...
  if (loading && !users.length && !friends.length) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A0D42" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        renderItem={renderUserItem}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContainer}
        refreshing={loading}
        onRefresh={() => {
          fetchUsers();
          fetchFriends();
          
          if (socket && currentUser) {
            socket.emit('get_pending_requests', { userId: currentUser._id });
          }
        }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No users available to add</Text>
        }
        ListHeaderComponent={
          <>
            {/* Pending Requests Section */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Pending Requests</Text>
              {pendingRequests.length > 0 ? (
                pendingRequests.map(request => renderPendingRequest(request))
              ) : (
                <Text style={styles.emptyText}>No pending requests</Text>
              )}
            </View>

            {/* Friends Section */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Your Friends</Text>
              {friends.length > 0 ? (
                <View style={styles.friendsGrid}>
                  {friends.map(friend => renderFriend(friend))}
                </View>
              ) : (
                <Text style={styles.emptyText}>No friends yet</Text>
              )}
            </View>
          </>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    marginTop: 30
  },
  titleContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  requestsBadge: {
    backgroundColor: '#F94989',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  requestsBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100, // Extra padding at bottom for friends section
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  // New style for profile icon container
  profileIconContainer: {
    backgroundColor: '#4A0D42',
    justifyContent: 'center',
    alignItems: 'center',
    // Shadow properties are inherited from parent
  },
  cardContent: {
    marginLeft: 16,
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  mutualFriends: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: '#4A0D42',
  },
  friendsButton: {
    backgroundColor: '#999',
  },
  pendingButton: {
    backgroundColor: '#F94989',
  },
  respondButton: {
    backgroundColor: '#4A0D42',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#4A0D42',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 40,
  },
  // Friends section styles
  friendsSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  friendsHeader: {
    paddingHorizontal: 6,
    marginBottom: 12,
  },
  friendsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  friendsListContainer: {
    paddingHorizontal: 6,
    paddingBottom: 10,
  },
  friendCard: {
    alignItems: 'center',
    marginRight: 20,
    width: 70,
  },
  emptyFriendsText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
    padding: 10,
  },
  sectionContainer: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  requestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    padding: 8,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  requestContent: {
    flex: 1,
    marginLeft: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#4A0D42',
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  friendsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginHorizontal: -8,
  },
  friendCard: {
    width: '33.33%',
    padding: 8,
    alignItems: 'center',
  },
  friendName: {
    fontSize: 14,
    textAlign: 'center',
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    padding: 12,
  },
});

export default UsersScreen;