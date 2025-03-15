import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useLocalSearchParams } from 'expo-router';
import { useSocket } from '../components/SocketContext';

export default function FriendLocationScreen() {
  const params = useLocalSearchParams();
  const { userName } = params;
  const [location, setLocation] = useState({
    latitude: parseFloat(params.latitude),
    longitude: parseFloat(params.longitude),
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    // Listen for location updates for this specific user
    socket.on("locationUpdate", (data) => {
      if (data.username === userName) {
        setLocation(prev => ({
          ...prev,
          latitude: parseFloat(data.latitude),
          longitude: parseFloat(data.longitude),
        }));
      }
    });

    return () => {
      if (socket) {
        socket.off("locationUpdate");
      }
    };
  }, [socket, userName]);

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={location}
      >
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title={userName}
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
