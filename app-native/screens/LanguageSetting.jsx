import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const LanguageSettingScreen = ({ navigation }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  
  const languages = [
    { code: 'en', display: 'A', name: 'English' },
    { code: 'ta', display: 'அ', name: 'தமிழ்' },
    { code: 'hi', display: 'अ', name: 'हिंदी' },
    { code: 'de', display: 'De', name: 'Deutsch' },
    { code: 'fr', display: 'Fr', name: 'Français' },
    { code: 'es', display: 'Es', name: 'Español' },
    { code: 'it', display: 'It', name: 'Italiano' },
    { code: 'pt', display: 'Pt', name: 'Português' },
    { code: 'ru', display: 'Ру', name: 'Русский' },
    { code: 'ja', display: '日', name: '日本語' },
    { code: 'ko', display: '한', name: '한국어' },
    { code: 'zh', display: '中', name: '中文' },
    { code: 'ar', display: 'ع', name: 'العربية' },
  ];
  
  const selectLanguage = (language) => {
    setSelectedLanguage(language);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Language setting</Text>
      </View>
      
      {/* Language Grid */}
      <ScrollView style={styles.scrollView}>
        <View style={styles.languageGrid}>
          {languages.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={[
                styles.languageCard,
                selectedLanguage === lang.name && styles.selectedLanguageCard
              ]}
              onPress={() => selectLanguage(lang.name)}
            >
              <Text 
                style={[
                  styles.languageSymbol,
                  selectedLanguage === lang.name && styles.selectedLanguageText
                ]}
              >
                {lang.display}
              </Text>
              <Text 
                style={[
                  styles.languageName,
                  selectedLanguage === lang.name && styles.selectedLanguageText
                ]}
              >
                {lang.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '500',
    marginLeft: 20,
    color: '#000000',
  },
  scrollView: {
    flex: 1,
  },
  languageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  languageCard: {
    width: '31%',
    aspectRatio: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 5,
  },
  selectedLanguageCard: {
    backgroundColor: '#FFCCE7',
    borderColor: '#FFCCE7',
  },
  languageSymbol: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000000',
  },
  languageName: {
    fontSize: 16,
    color: '#666666',
  },
  selectedLanguageText: {
    color: '#F06292',
  },
});

export default LanguageSettingScreen;
