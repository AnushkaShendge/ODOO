import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  StatusBar,
  SafeAreaView,
  Alert
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, MaterialIcons, FontAwesome } from '@expo/vector-icons';

const RestoreAccountScreen = () => {
  // Handle No button press
  const handleNoPress = () => {
    Alert.alert('Cancelled', 'Account restoration cancelled');
  };
  
  // Handle Yes button press
  const handleYesPress = () => {
    Alert.alert('Proceeding', 'Account restoration in progress');
  };
  
  // Handle Terms and Privacy links
  const handleTCPress = () => {
    Alert.alert('Terms & Conditions', 'Opening Terms & Conditions');
  };
  
  const handlePrivacyPress = () => {
    Alert.alert('Privacy Policy', 'Opening Privacy Policy');
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header with time and status icons */}
      <View style={styles.header}>
        <Text style={styles.timeText}>3:22</Text>
        <View style={styles.recordingBadge}>
          <MaterialIcons name="fiber-manual-record" size={16} color="white" />
          <Text style={styles.recordingText}>12:36</Text>
        </View>
        <View style={styles.headerRightIcons}>
          <Ionicons name="bluetooth" size={16} style={styles.iconMargin} />
          <Ionicons name="volume-mute" size={16} style={styles.iconMargin} />
          <Ionicons name="wifi" size={16} style={styles.iconMargin} />
          <MaterialCommunityIcons name="signal" size={16} style={styles.iconMargin} />
          <MaterialCommunityIcons name="battery-30" size={16} />
          <Text style={styles.smallText}>28%</Text>
        </View>
      </View>
      
      {/* Dialog Box */}
      <View style={styles.dialogContainer}>
        <View style={styles.dialogBox}>
          <Text style={styles.dialogTitle}>Restore Account?</Text>
          
          {/* User Icon */}
          <View style={styles.userIconContainer}>
            <View style={styles.userIconCircle}>
              <View style={styles.userIconHead}></View>
            </View>
            <View style={styles.userIconBody}></View>
          </View>
          
          {/* Dialog Message */}
          <Text style={styles.dialogMessage}>
            By logging in the Account will be restored. Are you sure you want to proceed?
          </Text>
          
          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.noButton} 
              onPress={handleNoPress}
            >
              <Text style={styles.noButtonText}>No</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.yesButton} 
              onPress={handleYesPress}
            >
              <Text style={styles.yesButtonText}>Yes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      
      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          By continuing, you agree that you have read and accepted our{' '}
        </Text>
        <View style={styles.footerLinks}>
          <TouchableOpacity onPress={handleTCPress}>
            <Text style={styles.footerLinkText}>T&Cs</Text>
          </TouchableOpacity>
          <Text style={styles.footerText}> and </Text>
          <TouchableOpacity onPress={handlePrivacyPress}>
            <Text style={styles.footerLinkText}>Privacy Policy</Text>
          </TouchableOpacity>
        </View>
        
        {/* Home Indicator Bar */}
        <View style={styles.homeIndicator}></View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(128, 128, 128, 0.9)',
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
  },
  recordingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dd3333',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 15,
  },
  recordingText: {
    color: 'white',
    fontSize: 12,
    marginLeft: 4,
  },
  headerRightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallText: {
    fontSize: 12,
    marginHorizontal: 2,
    color: 'white',
  },
  iconMargin: {
    marginHorizontal: 4,
    color: 'white',
  },
  dialogContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  dialogBox: {
    width: '100%',
    backgroundColor: '#f8e8ed',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  dialogTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginVertical: 20,
  },
  userIconContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  userIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f4a9c1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userIconHead: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#f8e8ed',
  },
  userIconBody: {
    width: 50,
    height: 25,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: '#f4a9c1',
    marginTop: -5,
  },
  dialogMessage: {
    fontSize: 16,
    textAlign: 'center',
    color: '#888',
    marginBottom: 30,
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 10,
  },
  noButton: {
    backgroundColor: '#5d1049',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 40,
    minWidth: 120,
    alignItems: 'center',
  },
  noButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  yesButton: {
    backgroundColor: 'transparent',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#5d1049',
    paddingVertical: 12,
    paddingHorizontal: 40,
    minWidth: 120,
    alignItems: 'center',
  },
  yesButtonText: {
    color: '#5d1049',
    fontSize: 18,
    fontWeight: '500',
  },
  footer: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 12,
    color: 'white',
    textAlign: 'center',
  },
  footerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerLinkText: {
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
  },
  homeIndicator: {
    width: 135,
    height: 5,
    backgroundColor: 'white',
    borderRadius: 3,
    marginTop: 15,
  },
});

export default RestoreAccountScreen;