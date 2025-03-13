import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar,
  TextInput,
  Image
} from 'react-native';
import { 
  Feather, 
  FontAwesome5, 
  MaterialIcons
} from '@expo/vector-icons';
import CountryPicker from 'react-native-country-picker-modal';

const SignUpScreen = () => {
  const [countryCode, setCountryCode] = useState('IN');
  const [callingCode, setCallingCode] = useState('91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryPickerVisible, setCountryPickerVisible] = useState(false);

  const onSelectCountry = (country) => {
    setCountryCode(country.cca2);
    setCallingCode(country.callingCode[0]);
    setCountryPickerVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <FontAwesome5 name="dove" size={24} color="#F94989" />
          <Text style={styles.logoText}>I'M SAFE</Text>
        </View>
        
        <TouchableOpacity style={styles.languageSelector}>
          <Image 
            source={{ uri: 'https://flagcdn.com/w40/gb.png' }} 
            style={styles.flagIcon}
            resizeMode="contain"
          />
          <Text style={styles.languageText}>English</Text>
          <MaterialIcons name="keyboard-arrow-down" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      
      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Sign Up/ Log in</Text>
        
        <Text style={styles.inputLabel}>Enter your mobile Number</Text>
        
        <View style={styles.phoneInputContainer}>
          {/* Country code selector */}
          <TouchableOpacity 
            style={styles.countrySelector}
            onPress={() => setCountryPickerVisible(true)}
          >
            <CountryPicker
              visible={countryPickerVisible}
              withFilter
              withFlag
              withCallingCode
              withCallingCodeButton={false}
              withEmoji={false}
              onSelect={onSelectCountry}
              countryCode={countryCode}
              onClose={() => setCountryPickerVisible(false)}
              renderFlagButton={() => (
                <View style={styles.flagButtonContainer}>
                  <CountryPicker
                    countryCode={countryCode}
                    withFlag
                    withEmoji={false}
                    onSelect={onSelectCountry}
                    withCallingCodeButton={false}
                    visible={false}
                  />
                  <MaterialIcons name="keyboard-arrow-down" size={20} color="#666" />
                </View>
              )}
            />
          </TouchableOpacity>
          
          {/* Phone input with prefix */}
          <View style={styles.phoneWrapper}>
            <Text style={styles.prefixText}>+{callingCode}</Text>
            <TextInput
              style={styles.phoneInput}
              keyboardType="phone-pad"
              placeholder="Enter phone number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
          </View>
        </View>
        
        {/* Continue button */}
        <TouchableOpacity style={styles.continueButton}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
        
        {/* Or separator */}
        <View style={styles.orSeparator}>
          <View style={styles.separatorLine} />
          <Text style={styles.orText}>Or</Text>
          <View style={styles.separatorLine} />
        </View>
        
        {/* Google button */}
        <TouchableOpacity style={styles.googleButton}>
          <Image 
            source={{ uri: 'https://developers.google.com/identity/images/g-logo.png' }} 
            style={styles.googleIcon}
            resizeMode="contain"
          />
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </TouchableOpacity>
      </View>
      
      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.termsText}>
          By continuing, you agree that you have read and accepted our 
          <Text style={styles.termsLink}> T&Cs </Text> 
          and 
          <Text style={styles.termsLink}> Privacy Policy</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: StatusBar.currentHeight || 0,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F94989',
    marginLeft: 10,
  },
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  flagIcon: {
    width: 24,
    height: 16,
    marginRight: 8,
  },
  languageText: {
    fontSize: 16,
    color: '#333',
    marginRight: 5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
  },
  inputLabel: {
    fontSize: 18,
    color: '#333',
    marginBottom: 15,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  countrySelector: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 10,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 110,
  },
  flagButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 5,
  },
  phoneWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  prefixText: {
    fontSize: 16,
    color: '#333',
    marginRight: 5,
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
  },
  continueButton: {
    backgroundColor: '#4A0D42',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 30,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  orSeparator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  orText: {
    marginHorizontal: 15,
    fontSize: 16,
    color: '#888',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 30,
    paddingVertical: 16,
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  googleButtonText: {
    fontSize: 16,
    color: '#333',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  termsText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 14,
    lineHeight: 20,
  },
  termsLink: {
    color: '#4A0D42',
    fontWeight: '500',
  },
});

export default SignUpScreen;