import React, { useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar,
  Image,
  Dimensions,
  Animated
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const ProfileSelectionScreen = () => {
  const router = useRouter();
  const gradientAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(gradientAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: false,
        }),
        Animated.timing(gradientAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [gradientAnim]);

  const backgroundColor = gradientAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#F3F9FF', '#EEFAFF']
  });

  const modules = [
    { 
      id: '2', 
      name: 'Financial Literacy', 
      color: '#20A4F3',
      image: require('../assets/images/literacy-icon.png'),
      route: '/(tabs2)',
      position: 'top'
    },
    { 
      id: '1', 
      name: 'Shakti', 
      color: '#FF3A5A',
      image: require('../assets/images/safety-icon.png'),
      route: '/(tabs)',
      position: 'center'
    },
    { 
      id: '3', 
      name: 'Skill Development', 
      color: '#7B61FF',
      image: require('../assets/images/development-icon.png'),
      route: '/(tabs3)',
      position: 'bottom'
    },
  ];

  const handleModuleSelect = (moduleId) => {
    const selectedModule = modules.find(module => module.id === moduleId);
    if (selectedModule) {
      router.push(selectedModule.route);
    }
  };

  const handleAddProfile = () => {
    // Navigate to create profile screen
    router.push('/create-profile');
  };

  const handleEditProfile = () => {
    // Navigate to edit profiles screen
    router.push('/edit-profiles');
  };

  // Separate modules by position
  const topModule = modules.find(module => module.position === 'top');
  const centerModule = modules.find(module => module.position === 'center');
  const bottomModule = modules.find(module => module.position === 'bottom');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Background gradient */}
      <Animated.View style={[styles.backgroundGradient, { backgroundColor }]} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Select Profile</Text>
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuButtonText}>⋮</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.profilesContainer}>
        {/* Top Module */}
        {topModule && (
          <TouchableOpacity 
            key={topModule.id}
            style={styles.topProfileItem}
            onPress={() => handleModuleSelect(topModule.id)}
          >
            <LinearGradient
              colors={[topModule.color, topModule.color + 'CC']}
              style={styles.smallAvatarContainer}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Image source={topModule.image} style={styles.smallAvatar} />
            </LinearGradient>
            <Text style={styles.profileName}>{topModule.name}</Text>
          </TouchableOpacity>
        )}

        {/* Center Module (Larger) */}
        {centerModule && (
          <TouchableOpacity 
            key={centerModule.id}
            style={styles.centerProfileItem}
            onPress={() => handleModuleSelect(centerModule.id)}
          >
            <LinearGradient
              colors={[centerModule.color, centerModule.color + 'CC']}
              style={styles.largeAvatarContainer}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Image source={centerModule.image} style={styles.largeAvatar} />
            </LinearGradient>
            <Text style={styles.centerProfileName}>{centerModule.name}</Text>
          </TouchableOpacity>
        )}

        {/* Bottom Module */}
        {bottomModule && (
          <TouchableOpacity 
            key={bottomModule.id}
            style={styles.bottomProfileItem}
            onPress={() => handleModuleSelect(bottomModule.id)}
          >
            <LinearGradient
              colors={[bottomModule.color, bottomModule.color + 'CC']}
              style={styles.smallAvatarContainer}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Image source={bottomModule.image} style={styles.smallAvatar} />
            </LinearGradient>
            <Text style={styles.profileName}>{bottomModule.name}</Text>
          </TouchableOpacity>
        )}
        
      </View>
      
      <TouchableOpacity 
        style={styles.editButton}
        onPress={handleEditProfile}
      >
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    position: 'absolute',
    width: width,
    height: height,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    zIndex: 1,
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    color: '#333333',
    fontSize: 24,
  },
  title: {
    color: '#333333',
    fontSize: 20,
    fontWeight: '600',
  },
  menuButton: {
    padding: 10,
  },
  menuButtonText: {
    color: '#333333',
    fontSize: 24,
  },
  profilesContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 20,
    zIndex: 1,
  },
  topProfileItem: {
    alignItems: 'center',
    marginBottom: 20,
    width: 100,
  },
  centerProfileItem: {
    alignItems: 'center',
    marginVertical: 20,
    width: 150,
  },
  bottomProfileItem: {
    alignItems: 'center',
    marginTop: 20,
    width: 100,
  },
  smallAvatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  largeAvatarContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  smallAvatar: {
    width: 60,
    height: 60,
  },
  largeAvatar: {
    width: 90,
    height: 90,
  },
  profileName: {
    color: '#333333',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  centerProfileName: {
    color: '#333333',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  addProfileItem: {
    alignItems: 'center',
    marginTop: 30,
  },
  addAvatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  addIcon: {
    color: '#666666',
    fontSize: 40,
  },
  addProfileText: {
    color: '#333333',
    fontSize: 14,
    fontWeight: '500',
  },
  editButton: {
    marginHorizontal: 20,
    marginBottom: 30,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#666666',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    zIndex: 1,
    marginTop:8
  },
  editButtonText: {
    color: '#333333',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileSelectionScreen;