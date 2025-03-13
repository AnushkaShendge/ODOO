import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FeedbackScreen = () => {
  const [sliderValue, setSliderValue] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [email, setEmail] = useState('');

  // Calculate the slider position
  const sliderPosition = sliderValue / 100;
  
  // Determine which mood is active based on slider position
  const getMoodType = () => {
    if (sliderPosition < 0.33) return 'Happy';
    if (sliderPosition < 0.66) return 'Unhappy';
    return 'Confused';
  };

  const moodType = getMoodType();

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#4A0E4A" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Feedback</Text>
      </View>
      
      {/* Content Container */}
      <View style={styles.contentContainer}>
        {/* Main Question */}
        <Text style={styles.questionText}>How do you feel using our app?</Text>
        
        {/* Mood Icon */}
        <View style={styles.moodIconContainer}>
          <View style={styles.moodIcon}>
            <Ionicons 
              name={moodType === 'Happy' ? 'happy-outline' : moodType === 'Unhappy' ? 'sad-outline' : 'help-outline'} 
              size={50} 
              color="#F06292" 
            />
          </View>
        </View>
        
        {/* Slider */}
        <View style={styles.sliderContainer}>
          <View style={styles.sliderTrack}>
            <View style={[styles.sliderFill, { width: `${sliderPosition * 100}%` }]} />
            <TouchableOpacity 
              style={[styles.sliderThumb, { left: `${sliderPosition * 100}%` }]}
              onGestureEvent={({nativeEvent}) => {
                // This would need proper gesture handling in a real implementation
              }}
            />
          </View>
          
          {/* Mood Labels */}
          <View style={styles.moodLabelsContainer}>
            <Text style={[styles.moodLabel, moodType === 'Happy' && styles.activeMoodLabel]}>Happy</Text>
            <Text style={[styles.moodLabel, moodType === 'Unhappy' && styles.activeMoodLabel]}>Unhappy</Text>
            <Text style={[styles.moodLabel, moodType === 'Confused' && styles.activeMoodLabel]}>Confused</Text>
          </View>
        </View>
        
        {/* Feedback Text Area */}
        <Text style={styles.sectionTitle}>Tell us more</Text>
        <View style={styles.textAreaContainer}>
          <TextInput
            style={styles.textArea}
            multiline={true}
            numberOfLines={6}
            placeholder=""
            value={feedbackText}
            onChangeText={setFeedbackText}
          />
          <Text style={styles.charCount}>0/500</Text>
        </View>
        
        {/* Email Field */}
        <Text style={styles.sectionTitle}>Email ID</Text>
        <View style={styles.emailInputContainer}>
          <TextInput
            style={styles.emailInput}
            placeholder=""
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>
        
        {/* Send Button */}
        <TouchableOpacity style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4A0E4A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  backButton: {
    marginRight: 20,
  },
  headerTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: '500',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  questionText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  moodIconContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  moodIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#F06292',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderContainer: {
    marginBottom: 40,
  },
  sliderTrack: {
    height: 4,
    backgroundColor: '#EAEAEA',
    borderRadius: 2,
    marginHorizontal: 20,
    position: 'relative',
  },
  sliderFill: {
    height: 4,
    backgroundColor: '#F06292',
    borderRadius: 2,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  sliderThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F06292',
    position: 'absolute',
    top: -10,
    marginLeft: -12, // Half the width to center it
  },
  moodLabelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingHorizontal: 20,
  },
  moodLabel: {
    color: '#AAA',
    fontSize: 16,
  },
  activeMoodLabel: {
    color: '#F06292',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  textAreaContainer: {
    marginBottom: 30,
    position: 'relative',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 15,
    padding: 15,
    height: 150,
    textAlignVertical: 'top',
  },
  charCount: {
    position: 'absolute',
    bottom: 10,
    right: 15,
    color: '#AAA',
  },
  emailInputContainer: {
    marginBottom: 30,
  },
  emailInput: {
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 15,
    padding: 15,
    height: 50,
  },
  sendButton: {
    backgroundColor: '#4A0E4A',
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: 'center',
    width: '60%',
    alignSelf: 'center',
  },
  sendButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default FeedbackScreen;