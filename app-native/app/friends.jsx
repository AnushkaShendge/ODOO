import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  FlatList,
  Image,
  ActivityIndicator,
  SectionList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import io from 'socket.io-client';

const UsersScreen = () => {
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const url = "http://192.168.94.60:5000";
  const socketRef = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      await getCurrentUser();
      await fetchUsers();
      await fetchFriends();
    };
    
    loadData();

    // Initialize socket connection
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (currentUser && !socketRef.current) {
      // Initialize the socket connection
      socketRef.current = io(url);

      // Request pending friend requests upon connection
      socketRef.current.on('connect', () => {
        socketRef.current.emit('get_pending_requests', { userId: currentUser._id });
      });

      // Listen for incoming friend requests
      socketRef.current.on('new_friend_request', (request) => {
        if (request.receiver === currentUser._id) {
          setPendingRequests(prev => [...prev, request]);
          // Refresh user list to update UI
          fetchUsers();
        }
      });

      // Listen for accepted friend requests
      socketRef.current.on('friend_request_accepted', (request) => {
        // Refresh friends list and users list
        fetchFriends();
        fetchUsers();
      });

      // Listen for pending requests data
      socketRef.current.on('pending_requests', (requests) => {
        setPendingRequests(requests);
      });
    }
  }, [currentUser]);

  const getCurrentUser = async () => {
    try {
      const userStr = await AsyncStorage.getItem('userData');
      if (userStr) {
        const userData = JSON.parse(userStr);
        setCurrentUser(userData);
      }
    } catch (error) {
      console.error('Error getting current user:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${url}/api/user`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const data = await response.json();
      
      // Get current user ID from AsyncStorage
      const userStr = await AsyncStorage.getItem('userData');
      if (userStr) {
        const userData = JSON.parse(userStr);
        
        // Filter out the current user and any users who are already friends
        const filteredUsers = data.filter(user => 
          user._id !== userData._id && 
          user.friendshipStatus !== 'friends'
        );
        
        setUsers(filteredUsers);
      } else {
        setUsers(data);
      }
      
      setError(null);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Unable to load users. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchFriends = async () => {
    try {
      const userStr = await AsyncStorage.getItem('userData');
      if (!userStr) return;
      
      const userData = JSON.parse(userStr);
      
      const response = await fetch(`${url}/api/friends/${userData._id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch friends');
      }
      
      const data = await response.json();
      setFriends(data);
    } catch (error) {
      console.error('Error fetching friends:', error);
      // We don't set the main error state here to avoid interfering with the main user list
    }
  };

  const sendFriendRequest = async (userId) => {
    if (!currentUser) return;
    
    try {
      // Emit the friend request via socket
      socketRef.current.emit('send_friend_request', { 
        senderId: currentUser._id, 
        receiverId: userId 
      });
      
      // Optimistically update UI to show pending status for this user
      setUsers(prev => 
        prev.map(user => 
          user._id === userId 
            ? { ...user, friendshipStatus: 'pending' } 
            : user
        )
      );
      
    } catch (error) {
      console.error('Error sending friend request:', error);
      alert('Failed to send friend request. Please try again.');
    }
  };

  const acceptFriendRequest = (requestId) => {
    if (!currentUser || !socketRef.current) return;
    
    socketRef.current.emit('accept_friend_request', { requestId });
    
    // Optimistically update the UI
    setPendingRequests(prev => prev.filter(req => req._id !== requestId));
  };

  const navigateToFriendRequests = () => {
    // This would typically navigate to a friend requests screen
    // For now, let's just display the pending requests in an alert
    if (pendingRequests.length > 0) {
      const requestNames = pendingRequests.map(req => 
        req.sender?.name || 'Unknown user'
      ).join(', ');
      
      alert(`You have pending requests from: ${requestNames}`);
    } else {
      alert('No pending friend requests');
    }
  };

  const renderUserItem = ({ item }) => {
    // Check if this user has a pending request in our list
    const hasPendingRequest = pendingRequests.some(
      req => req.sender === item._id && req.status === 'pending'
    );
    
    // Determine button state based on friendship status
    let buttonText = 'Add Friend';
    let buttonStyle = styles.addButton;
    let onPress = () => sendFriendRequest(item._id);
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
        <Image
          source={{ uri: item.profilePicture || 'https://via.placeholder.com/50' }}
          style={styles.profilePic}
        />
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

  const renderFriendItem = ({ item }) => (
    <View style={styles.friendCard}>
      <Image
        source={{ uri: item.profilePicture || 'https://via.placeholder.com/40' }}
        style={styles.friendProfilePic}
      />
      <Text style={styles.friendName} numberOfLines={1}>{item.name}</Text>
    </View>
  );

  if (loading && !users.length && !friends.length) {
    return (
      <SafeAreaView style={styles.container}>
        <Header />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A0D42" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && !users.length) {
    return (
      <SafeAreaView style={styles.container}>
        <Header />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchUsers}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      
      <Header />
      
      <View style={styles.titleContainer}>
        <Text style={styles.screenTitle}>Find Friends</Text>
        {pendingRequests.length > 0 && (
          <TouchableOpacity 
            style={styles.requestsBadge}
            onPress={navigateToFriendRequests}
          >
            <Text style={styles.requestsBadgeText}>{pendingRequests.length}</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={users}
        renderItem={renderUserItem}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContainer}
        refreshing={loading}
        onRefresh={() => {
          fetchUsers();
          fetchFriends();
          
          if (socketRef.current && currentUser) {
            socketRef.current.emit('get_pending_requests', { userId: currentUser._id });
          }
        }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No users available to add</Text>
        }
        ListFooterComponent={
          <>
            {friends.length > 0 && (
              <View style={styles.friendsSection}>
                <View style={styles.friendsHeader}>
                  <Text style={styles.friendsTitle}>Your Friends</Text>
                </View>
                <FlatList
                  data={friends}
                  renderItem={renderFriendItem}
                  keyExtractor={item => item._id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.friendsListContainer}
                  ListEmptyComponent={
                    <Text style={styles.emptyFriendsText}>You have no friends yet</Text>
                  }
                />
              </View>
            )}
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
  profilePic: {
    width: 60,
    height: 60,
    borderRadius: 30,
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
  friendProfilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 8,
  },
  friendName: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    width: '100%',
  },
  emptyFriendsText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
    padding: 10,
  },
});

export default UsersScreen;