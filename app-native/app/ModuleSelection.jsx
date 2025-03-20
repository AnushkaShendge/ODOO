import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, StatusBar, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const ModuleSelectionScreen = () => {
    const router = useRouter();
  

  const navigateToModule = (module) => {
    switch(module) {
      case 'safety':
        router.push('/(tabs)'); // This should point to your existing tabs folder
        break;
      case 'literacy':
        router.push('/(tabs2)'); // This should point to your tabs2 folder
        break;
      case 'development':
        router.push('/(tabs3)'); // This should point to your tabs3 folder
        break;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <LinearGradient
        colors={['#8A2387', '#E94057', '#F27121']}
        style={styles.background}
      />
      
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome</Text>
        <Text style={styles.subtitle}>Empowering every woman's journey</Text>
      </View>
      
      <View style={styles.modulesContainer}>
        <TouchableOpacity 
          style={styles.moduleCard} 
          onPress={() => navigateToModule('safety')}
        >
          <LinearGradient
            colors={['#FF416C', '#FF4B2B']}
            style={styles.cardGradient}
          >
            <Image 
              source={require('../assets/images/safety-icon.png')} 
              style={styles.moduleIcon}
            />
            <Text style={styles.moduleTitle}>Safety</Text>
            <Text style={styles.moduleDescription}>Tools and resources for personal safety</Text>
          </LinearGradient>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.moduleCard} 
          onPress={() => navigateToModule('literacy')}
        >
          <LinearGradient
            colors={['#43CEA2', '#185A9D']}
            style={styles.cardGradient}
          >
            <Image 
              source={require('../assets/images/literacy-icon.png')} 
              style={styles.moduleIcon}
            />
            <Text style={styles.moduleTitle}>Financial Literacy</Text>
            <Text style={styles.moduleDescription}>Learn to manage & grow your finances</Text>
          </LinearGradient>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.moduleCard} 
          onPress={() => navigateToModule('development')}
        >
          <LinearGradient
            colors={['#834D9B', '#D04ED6']}
            style={styles.cardGradient}
          >
            <Image 
              source={require('../assets/images/development-icon.png')} 
              style={styles.moduleIcon}
            />
            <Text style={styles.moduleTitle}>Skill Development</Text>
            <Text style={styles.moduleDescription}>Enhance your skills & career opportunities</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.footerText}>Choose a module to get started</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  header: {
    marginTop: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 40,
  },
  modulesContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  moduleCard: {
    height: 150,
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardGradient: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  moduleIcon: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  moduleTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  moduleDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  footerText: {
    textAlign: 'center',
    color: 'white',
    marginBottom: 20,
  },
});

export default ModuleSelectionScreen;