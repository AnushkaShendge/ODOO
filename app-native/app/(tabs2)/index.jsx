import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
  KeyboardAvoidingView,
  ActivityIndicator,
  Dimensions,
  Modal,
  Pressable
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons, MaterialCommunityIcons, FontAwesome5, AntDesign } from '@expo/vector-icons';
import Animated, { 
  useSharedValue, 
  useAnimatedScrollHandler,
  useAnimatedStyle, 
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');
const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

const ProfileScreen = () => {
  // State for profile information
  const [profileImage, setProfileImage] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dob, setDob] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [occupation, setOccupation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [documents, setDocuments] = useState([]);
  
  // State for financial information
  const [showIncomePicker, setShowIncomePicker] = useState(false);
  const [incomeValue, setIncomeValue] = useState(null);
  const [incomeLabel, setIncomeLabel] = useState('Select income source');
  const [incomeItems] = useState([
    {label: 'Full-time Employment', value: 'fulltime'},
    {label: 'Part-time Employment', value: 'parttime'},
    {label: 'Self-employed', value: 'selfemployed'},
    {label: 'Freelance', value: 'freelance'},
    {label: 'Investments', value: 'investments'},
    {label: 'Other', value: 'other'}
  ]);
  
  const [financialGoal, setFinancialGoal] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [creditScore, setCreditScore] = useState('');
  
  // Animation values
  const scrollY = useSharedValue(0);
  const headerHeight = useSharedValue(200);
  
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });
  
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(
        scrollY.value,
        [0, 100],
        [headerHeight.value, 120],
        Extrapolate.CLAMP
      ),
    };
  });
  
  const opacityAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        scrollY.value,
        [0, 60, 90],
        [1, 0.5, 0],
        Extrapolate.CLAMP
      ),
    };
  });
  
  // Custom date picker function to format dates
  const formatDate = (date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };
  
  // Custom date picker component
  const CustomDatePicker = () => {
    const [tempDate, setTempDate] = useState(dob);
    const today = new Date();
    const years = Array.from({length: 100}, (_, i) => today.getFullYear() - i);
    const months = Array.from({length: 12}, (_, i) => i);
    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const days = Array.from({length: getDaysInMonth(tempDate.getFullYear(), tempDate.getMonth())}, (_, i) => i + 1);
    
    return (
      <View style={styles.datePickerContainer}>
        <View style={styles.datePickerHeader}>
          <Text style={styles.datePickerTitle}>Select Date</Text>
          <TouchableOpacity onPress={() => setShowDatePicker(false)}>
            <AntDesign name="close" size={24} color="#4A5568" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.datePickerControls}>
          <View style={styles.pickerColumn}>
            <Text style={styles.pickerLabel}>Month</Text>
            <ScrollView style={styles.pickerScroll}>
              {months.map((month) => (
                <TouchableOpacity
                  key={`month-${month}`}
                  style={[
                    styles.pickerItem,
                    tempDate.getMonth() === month && styles.pickerItemSelected
                  ]}
                  onPress={() => setTempDate(new Date(tempDate.getFullYear(), month, Math.min(tempDate.getDate(), getDaysInMonth(tempDate.getFullYear(), month))))}
                >
                  <Text
                    style={[
                      styles.pickerItemText,
                      tempDate.getMonth() === month && styles.pickerItemTextSelected
                    ]}
                  >
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][month]}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          
          <View style={styles.pickerColumn}>
            <Text style={styles.pickerLabel}>Day</Text>
            <ScrollView style={styles.pickerScroll}>
              {days.map((day) => (
                <TouchableOpacity
                  key={`day-${day}`}
                  style={[
                    styles.pickerItem,
                    tempDate.getDate() === day && styles.pickerItemSelected
                  ]}
                  onPress={() => setTempDate(new Date(tempDate.getFullYear(), tempDate.getMonth(), day))}
                >
                  <Text
                    style={[
                      styles.pickerItemText,
                      tempDate.getDate() === day && styles.pickerItemTextSelected
                    ]}
                  >
                    {day}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          
          <View style={styles.pickerColumn}>
            <Text style={styles.pickerLabel}>Year</Text>
            <ScrollView style={styles.pickerScroll}>
              {years.map((year) => (
                <TouchableOpacity
                  key={`year-${year}`}
                  style={[
                    styles.pickerItem,
                    tempDate.getFullYear() === year && styles.pickerItemSelected
                  ]}
                  onPress={() => setTempDate(new Date(year, tempDate.getMonth(), Math.min(tempDate.getDate(), getDaysInMonth(year, tempDate.getMonth()))))}
                >
                  <Text
                    style={[
                      styles.pickerItemText,
                      tempDate.getFullYear() === year && styles.pickerItemTextSelected
                    ]}
                  >
                    {year}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
        
        <View style={styles.datePickerActions}>
          <TouchableOpacity
            style={styles.datePickerCancel}
            onPress={() => setShowDatePicker(false)}
          >
            <Text style={styles.datePickerCancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.datePickerConfirm}
            onPress={() => {
              setDob(tempDate);
              setShowDatePicker(false);
            }}
          >
            <Text style={styles.datePickerConfirmText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };
  
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });
      
      if (result.type === 'success') {
        setDocuments([...documents, {
          name: result.name,
          uri: result.uri,
          size: result.size,
          type: result.mimeType
        }]);
      }
    } catch (err) {
      Alert.alert('Error', 'Document picking failed');
    }
  };
  
  const renderPersonalInfoTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Basic Information</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your full name"
          placeholderTextColor="#86909C"
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email address"
          placeholderTextColor="#86909C"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="Enter your phone number"
          placeholderTextColor="#86909C"
          keyboardType="phone-pad"
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Date of Birth</Text>
        <TouchableOpacity 
          style={styles.datePickerButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateText}>
            {formatDate(dob)}
          </Text>
          <Ionicons name="calendar" size={20} color="#15B29D" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Occupation</Text>
        <TextInput
          style={styles.input}
          value={occupation}
          onChangeText={setOccupation}
          placeholder="Enter your occupation"
          placeholderTextColor="#86909C"
        />
      </View>
    </View>
  );
  
  const renderFinancialInfoTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Financial Details</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Primary Income Source</Text>
        <TouchableOpacity 
          style={styles.customDropdown}
          onPress={() => setShowIncomePicker(true)}
        >
          <Text style={incomeValue ? styles.dropdownSelectedText : styles.dropdownPlaceholder}>
            {incomeValue ? incomeItems.find(item => item.value === incomeValue)?.label : "Select your income source"}
          </Text>
          <AntDesign name="down" size={16} color="#86909C" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Monthly Income ($)</Text>
        <TextInput
          style={styles.input}
          value={monthlyIncome}
          onChangeText={setMonthlyIncome}
          placeholder="Enter your monthly income"
          placeholderTextColor="#86909C"
          keyboardType="numeric"
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Credit Score (Optional)</Text>
        <TextInput
          style={styles.input}
          value={creditScore}
          onChangeText={setCreditScore}
          placeholder="Enter your credit score"
          placeholderTextColor="#86909C"
          keyboardType="numeric"
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Financial Goal</Text>
        <TextInput
          style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
          value={financialGoal}
          onChangeText={setFinancialGoal}
          placeholder="Describe your financial goals..."
          placeholderTextColor="#86909C"
          multiline
        />
      </View>
    </View>
  );
  
  const renderDocumentsTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Documents & Verification</Text>
      
      <TouchableOpacity 
        style={styles.uploadArea}
        onPress={pickDocument}
      >
        <MaterialCommunityIcons name="file-upload-outline" size={40} color="#15B29D" />
        <Text style={styles.uploadText}>Upload Financial Documents</Text>
        <Text style={styles.uploadSubtext}>Bank statements, tax returns, etc.</Text>
      </TouchableOpacity>
      
      {documents.length > 0 && (
        <View style={styles.documentsList}>
          <Text style={styles.documentsTitle}>Uploaded Documents</Text>
          {documents.map((doc, index) => (
            <View key={index} style={styles.documentItem}>
              <View style={styles.documentInfo}>
                <FontAwesome5 name="file-alt" size={20} color="#1A6EB0" />
                <Text style={styles.documentName} numberOfLines={1}>{doc.name}</Text>
              </View>
              <TouchableOpacity onPress={() => {
                const updatedDocs = [...documents];
                updatedDocs.splice(index, 1);
                setDocuments(updatedDocs);
              }}>
                <Ionicons name="close-circle" size={22} color="#FF4D4F" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
      
      <View style={styles.verificationNote}>
        <AntDesign name="Safety" size={20} color="#15B29D" />
        <Text style={styles.noteText}>
          Your documents are securely encrypted and will only be used for verification purposes.
        </Text>
      </View>
    </View>
  );
  
  const saveProfile = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        "Profile Updated",
        "Your profile has been successfully updated!",
        [{ text: "OK" }]
      );
    }, 1500);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar style="light" />
      <AnimatedScrollView 
        contentContainerStyle={styles.scrollContent}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <Animated.View style={[styles.header, headerAnimatedStyle]}>
          <LinearGradient
            colors={['#1A6EB0', '#15B29D']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradient}
          >
            <Animated.View style={[styles.profileContainer, opacityAnimatedStyle]}>
              <TouchableOpacity onPress={pickImage} style={styles.profileImageContainer}>
                {profileImage ? (
                  <Image source={{ uri: profileImage }} style={styles.profileImage} />
                ) : (
                  <View style={styles.placeholderImage}>
                    <FontAwesome5 name="user-alt" size={40} color="#FFFFFF" />
                  </View>
                )}
                <View style={styles.cameraIcon}>
                  <Ionicons name="camera" size={16} color="#FFFFFF" />
                </View>
              </TouchableOpacity>
              <Text style={styles.uploadPhotoText}>Tap to upload profile picture</Text>
            </Animated.View>
          </LinearGradient>
        </Animated.View>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Complete Your Profile</Text>
          <Text style={styles.cardSubtitle}>Help us create a personalized financial experience for you</Text>
          
          <View style={styles.tabContainer}>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'personal' && styles.activeTab]} 
              onPress={() => setActiveTab('personal')}
            >
              <Ionicons 
                name="person" 
                size={20} 
                color={activeTab === 'personal' ? '#15B29D' : '#86909C'} 
              />
              <Text style={[styles.tabText, activeTab === 'personal' && styles.activeTabText]}>
                Personal
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'financial' && styles.activeTab]} 
              onPress={() => setActiveTab('financial')}
            >
              <MaterialCommunityIcons 
                name="cash-multiple" 
                size={20} 
                color={activeTab === 'financial' ? '#15B29D' : '#86909C'} 
              />
              <Text style={[styles.tabText, activeTab === 'financial' && styles.activeTabText]}>
                Financial
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'documents' && styles.activeTab]} 
              onPress={() => setActiveTab('documents')}
            >
              <FontAwesome5 
                name="file-alt" 
                size={20} 
                color={activeTab === 'documents' ? '#15B29D' : '#86909C'} 
              />
              <Text style={[styles.tabText, activeTab === 'documents' && styles.activeTabText]}>
                Documents
              </Text>
            </TouchableOpacity>
          </View>
          
          {activeTab === 'personal' && renderPersonalInfoTab()}
          {activeTab === 'financial' && renderFinancialInfoTab()}
          {activeTab === 'documents' && renderDocumentsTab()}
          
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={saveProfile}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.saveButtonText}>Save Profile</Text>
                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
              </>
            )}
          </TouchableOpacity>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: activeTab === 'personal' ? '33%' : 
                           activeTab === 'financial' ? '66%' : '100%' 
                  }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {activeTab === 'personal' ? '1/3' : 
               activeTab === 'financial' ? '2/3' : '3/3'} Complete
            </Text>
          </View>
        </View>
      </AnimatedScrollView>

      {/* Custom Date Picker Modal */}
      <Modal
        visible={showDatePicker}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <CustomDatePicker />
          </View>
        </View>
      </Modal>

      {/* Income Source Picker Modal */}
      <Modal
        visible={showIncomePicker}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>Select Income Source</Text>
              <TouchableOpacity onPress={() => setShowIncomePicker(false)}>
                <AntDesign name="close" size={24} color="#4A5568" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.pickerItemsContainer}>
              {incomeItems.map((item) => (
                <TouchableOpacity
                  key={item.value}
                  style={[
                    styles.pickerSelectItem,
                    incomeValue === item.value && styles.pickerSelectItemActive
                  ]}
                  onPress={() => {
                    setIncomeValue(item.value);
                    setShowIncomePicker(false);
                  }}
                >
                  <Text
                    style={[
                      styles.pickerItemText,
                      incomeValue === item.value && styles.pickerItemTextSelected
                    ]}
                  >
                    {item.label}
                  </Text>
                  {incomeValue === item.value && (
                    <Ionicons name="checkmark" size={20} color="#15B29D" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.pickerCancelButton}
              onPress={() => setShowIncomePicker(false)}
            >
              <Text style={styles.pickerCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    height: 200,
    width: '100%',
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  profileContainer: {
    alignItems: 'center',
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: '#E0E0E0',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#15B29D',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  uploadPhotoText: {
    color: '#FFFFFF',
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  uploadPhotoText: {
    color: '#FFFFFF',
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: -40,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#86909C',
    marginBottom: 24,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#E8E8E8',
  },
  activeTab: {
    borderBottomColor: '#15B29D',
  },
  tabText: {
    fontSize: 14,
    color: '#86909C',
    marginTop: 4,
  },
  activeTabText: {
    color: '#15B29D',
    fontWeight: '600',
  },
  tabContent: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#4A5568',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F5F7FA',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1A1A1A',
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F7FA',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dateText: {
    fontSize: 14,
    color: '#1A1A1A',
  },
  customDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F7FA',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dropdownSelectedText: {
    fontSize: 14,
    color: '#1A1A1A',
  },
  dropdownPlaceholder: {
    fontSize: 14,
    color: '#86909C',
  },
  uploadArea: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F7FA',
    borderRadius: 8,
    padding: 24,
    marginBottom: 16,
  },
  uploadText: {
    fontSize: 16,
    color: '#1A1A1A',
    marginTop: 8,
  },
  uploadSubtext: {
    fontSize: 12,
    color: '#86909C',
    marginTop: 4,
  },
  documentsList: {
    marginBottom: 16,
  },
  documentsTitle: {
    fontSize: 16,
    color: '#1A1A1A',
    marginBottom: 8,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F7FA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  documentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  documentName: {
    fontSize: 14,
    color: '#1A1A1A',
    marginLeft: 8,
    maxWidth: width - 150,
  },
  verificationNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    borderRadius: 8,
    padding: 12,
  },
  noteText: {
    fontSize: 12,
    color: '#86909C',
    marginLeft: 8,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#15B29D',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
  },
  saveButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    marginRight: 8,
  },
  progressContainer: {
    marginTop: 24,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E8E8E8',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#15B29D',
  },
  progressText: {
    fontSize: 12,
    color: '#86909C',
    marginTop: 8,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: width - 40,
    padding: 16,
  },
  datePickerContainer: {
    width: '100%',
  },
  datePickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  datePickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  datePickerControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  pickerColumn: {
    flex: 1,
    marginHorizontal: 4,
  },
  pickerLabel: {
    fontSize: 14,
    color: '#4A5568',
    marginBottom: 8,
    textAlign: 'center',
  },
  pickerScroll: {
    maxHeight: 150,
  },
  pickerItem: {
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerItemSelected: {
    backgroundColor: '#F5F7FA',
    borderRadius: 8,
  },
  pickerItemText: {
    fontSize: 14,
    color: '#1A1A1A',
  },
  pickerItemTextSelected: {
    color: '#15B29D',
    fontWeight: '600',
  },
  datePickerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  datePickerCancel: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F7FA',
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
  },
  datePickerCancelText: {
    fontSize: 14,
    color: '#4A5568',
  },
  datePickerConfirm: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#15B29D',
    borderRadius: 8,
    padding: 12,
  },
  datePickerConfirmText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  pickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  pickerItemsContainer: {
    maxHeight: 200,
  },
  pickerSelectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  pickerSelectItemActive: {
    backgroundColor: '#F5F7FA',
  },
  pickerCancelButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F7FA',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  pickerCancelText: {
    fontSize: 14,
    color: '#4A5568',
  },
});

export default ProfileScreen