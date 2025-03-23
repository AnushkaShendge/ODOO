import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, StatusBar, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons'; // Assuming using Expo, or you can use another icon library
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const SimulationCard = ({ title, iconName, description, color, onPress }) => {
  return (
    <View style={[styles.card, { borderLeftColor: color, borderLeftWidth: 4 }]}>
      <View style={styles.headerContainer}>
        <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
          <Feather name={iconName} size={24} color={color} />
        </View>
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text style={styles.description}>{description}</Text>
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: color }]} 
        onPress={onPress}
      >
        <Text style={styles.buttonText}>Try Simulation</Text>
        <Feather name="arrow-right" size={16} color="white" style={styles.buttonIcon} />
      </TouchableOpacity>
    </View>
  );
};

const FinancialSimulations = () => {
  const router = useRouter();
  const handleSimulationPress = (simulation) => {
    console.log(`Starting ${simulation} simulation`);
    router.push(`${simulation}`)
    
    // This would navigate to the actual simulation screen in a real application
    // Example: navigation.navigate(`${simulation}Simulation`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.heading}>Financial Education Simulations</Text>
        <Text style={styles.subheading}>
          Practice financial transactions in a safe environment to build confidence and knowledge
        </Text>
        
        <View style={styles.cardsContainer}>
          <SimulationCard 
            title="Net Banking" 
            iconName="globe"
            color="#4f46e5"
            description="Learn how to safely log in, check your balance, transfer money, and pay bills using online banking portals from any device."
            onPress={() => handleSimulationPress('netBanking')}
          />
          
          <SimulationCard 
            title="UPI Payments" 
            iconName="smartphone"
            color="#0ea5e9"
            description="Practice making instant payments using UPI apps, scanning QR codes, and managing your linked bank accounts securely."
            onPress={() => handleSimulationPress('upi')}
          />
          
          <SimulationCard 
            title="ATM Transactions" 
            iconName="credit-card"
            color="#10b981"
            description="Step-by-step guide to using ATMs for withdrawals, deposits, balance inquiries, and PIN changes with safety tips."
            onPress={() => handleSimulationPress('atm')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop:18
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32, // Extra padding at bottom for better scrolling experience
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subheading: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  cardsContainer: {
    width: '100%',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    padding: 10,
    borderRadius: 20,
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 16,
  },
  buttonIcon: {
    marginLeft: 8,
  },
});

export default FinancialSimulations;