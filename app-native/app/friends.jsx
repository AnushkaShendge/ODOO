import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useSocket } from '../components/SocketContext';

const UsersScreen = () => {
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { socket, userName } = useSocket(); // Use socket and userName from context
  const url = "https://normal-joint-hamster.ngrok-free.app";

  useEffect(() => {
    if (!socket || !userName) return;

    // Request pending friend requests upon connection
    socket.emit('get_pending_requests', { userName });

    // Listen for incoming friend requests
    socket.on('new_friend_request', (request) => {
      if (request.receiver === userName) {
        setPendingRequests((prev) => [...prev, request]);
        fetchUsers(); // Refresh user list to update UI
      }
    });

    // Listen for accepted friend requests
    socket.on('friend_request_accepted', () => {
      fetchFriends();
      fetchUsers();
    });

    // Listen for pending requests data
    socket.on('pending_requests', (requests) => {
      setPendingRequests(requests);
    });

    return () => {
      socket.off('new_friend_request');
      socket.off('friend_request_accepted');
      socket.off('pending_requests');
    };
  }, [socket, userName]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${url}/api/user`);
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      const filteredUsers = data.filter(
        (user) => user.userName !== userName && user.friendshipStatus !== 'friends'
      );
      setUsers(filteredUsers);
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
      const response = await fetch(`${url}/api/friends/${userName}`);
      if (!response.ok) throw new Error('Failed to fetch friends');
      const data = await response.json();
      setFriends(data);
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  const sendFriendRequest = (receiverName) => {
    if (!socket || !userName) return;
    socket.emit('send_friend_request', { senderName: userName, receiverName });
    setUsers((prev) =>
      prev.map((user) =>
        user.userName === receiverName
          ? { ...user, friendshipStatus: 'pending' }
          : user
      )
    );
  };

  const acceptFriendRequest = (requestId) => {
    if (!socket) return;
    socket.emit('accept_friend_request', { requestId });
    setPendingRequests((prev) => prev.filter((req) => req._id !== requestId));
  };

  const renderUserItem = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: item.profilePicture || 'https://via.placeholder.com/50' }}
        style={styles.profilePic}
      />
      <View style={styles.cardContent}>
        <Text style={styles.name}>{item.name}</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => sendFriendRequest(item.userName)}
        >
          <Text style={styles.buttonText}>Add Friend</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
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
        keyExtractor={(item) => item._id}
        ListEmptyComponent={<Text>No users available to add</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: { flexDirection: 'row', marginBottom: 16 },
  profilePic: { width: 50, height: 50, borderRadius: 25 },
  cardContent: { marginLeft: 16, justifyContent: 'center' },
  name: { fontSize: 16, fontWeight: 'bold' },
  addButton: { marginTop: 8, backgroundColor: '#4A0D42', padding: 8, borderRadius: 8 },
  buttonText: { color: 'white', fontWeight: 'bold' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default UsersScreen;