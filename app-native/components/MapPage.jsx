import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import io from "socket.io-client";

const { width, height } = Dimensions.get("window");
const socket = io("https://43fd-2402-3a80-1672-b094-1c4f-f461-56e8-3371.ngrok-free.app"); // Replace with your backend IP

const MapPage = () => {
  const [location, setLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [friends, setFriends] = useState({});
  const [locationInterval, setLocationInterval] = useState(null);
  const userName = "Anushka"; // Replace with actual username (e.g., from authentication)

  const checkLocationPermission = async () => {
    let { status } = await Location.getForegroundPermissionsAsync();
    if (status === "granted") {
      setLocationPermission(true);
      getCurrentLocation();
    } else {
      setLocationPermission(false);
    }
  };

  const requestLocationPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status === "granted") {
      setLocationPermission(true);
      getCurrentLocation();
    }
  };

  const getCurrentLocation = async () => {
    try {
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
      return location.coords;
    } catch (error) {
      console.error("Error getting location:", error);
      return null;
    }
  };

  const startTracking = () => {
    if (locationPermission) {
      console.log("Started tracking");
      setIsTracking(true);
      const interval = setInterval(() => {
        getCurrentLocation().then((loc) => {
          if (loc) {
            console.log(loc);
            socket.emit("shareLocation", {
              userName, // Using userName instead of userId
              latitude: loc.latitude,
              longitude: loc.longitude,
            });
          }
        });
      }, 5000); // Update location every 5 seconds

      setLocationInterval(interval);
    }
  };

  const stopTracking = () => {
    console.log("Stopped tracking");
    setIsTracking(false);
    if (locationInterval) {
      clearInterval(locationInterval);
      setLocationInterval(null);
    }
  };

  useEffect(() => {
    socket.emit("joinRoom", userName); // Use username instead of userId

    socket.on("locationUpdate", (users) => {
      setFriends(users);
      console.log("Updated friends:", users);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <View style={styles.container}>
      {locationPermission && location ? (
        <View style={styles.mapContainer}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            region={location}
            showsUserLocation={true}
            followsUserLocation={true}
          >
            {location && (
              <Marker
                coordinate={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                }}
              />
            )}
          </MapView>

          <TouchableOpacity
            style={styles.locationButton}
            onPress={getCurrentLocation}
          >
            <MaterialIcons name="my-location" size={24} color="black" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.trackMeButton}
            onPress={isTracking ? stopTracking : startTracking}
          >
            <Text style={styles.trackMeButtonText}>
              {isTracking ? "Stop tracking" : "Track me"}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.permissionContainer}>
          <View style={styles.locationIconContainer}>
            <Ionicons name="location-outline" size={50} color="black" />
          </View>

          <Text style={styles.permissionTitle}>
            Location permission is not enabled.
          </Text>

          <Text style={styles.permissionText}>
            Access to location is essential to locate you during emergencies.
          </Text>

          <Text style={styles.permissionText}>
            Allowing location access to "allow all the time" lets the user be tracked even when the app's screen is closed.
          </Text>

          <TouchableOpacity
            style={styles.enableButton}
            onPress={requestLocationPermission}
          >
            <Text style={styles.enableButtonText}>Enable</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.trackMeButtonDisabled}>
            <Text style={styles.trackMeButtonText}>Track me</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  mapContainer: {
    flex: 1,
    position: "relative",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  locationButton: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "white",
    borderRadius: 8,
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  trackMeButton: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    backgroundColor: "#FF4F93",
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  trackMeButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    backgroundColor: "white",
  },
  locationIconContainer: {
    marginBottom: 40,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  permissionText: {
    fontSize: 16,
    textAlign: "center",
    color: "#444",
    marginBottom: 15,
  },
  enableButton: {
    backgroundColor: "#4E1158",
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 40,
    marginTop: 30,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  enableButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  trackMeButtonDisabled: {
    backgroundColor: "#FF4F93",
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 50,
    marginTop: 20,
    opacity: 0.8,
  },
});

export default MapPage;
