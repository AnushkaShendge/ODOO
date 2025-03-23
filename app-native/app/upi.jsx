import React, { useState, useEffect, useRef } from 'react';
import { 
  NavigationContainer, 
  NavigationIndependentTree 
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  Image, 
  ScrollView, 
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Modal,
  Animated,
  Vibration,
  ToastAndroid,
  Alert,
  Platform,
  Dimensions,
  PermissionsAndroid,
  FlatList
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Camera as ExpoCamera } from 'expo-camera';

// Improved Camera import with better error handling
let Camera = null;
let isRNCameraAvailable = false;
try {
  // Try to dynamically import the camera module
  const cameraModule = require('react-native-camera');
  if (cameraModule && cameraModule.RNCamera) {
    Camera = cameraModule.RNCamera;
    isRNCameraAvailable = true;
  } else {
    console.warn('RNCamera import succeeded but component is not available');
  }
} catch (error) {
  console.warn('Could not load react-native-camera', error);
}

// Default constants for when Camera isn't available
const CameraDefaults = {
  Constants: {
    FlashMode: {
      off: 'off',
      torch: 'torch'
    },
    Type: {
      back: 'back'
    },
    BarCodeType: {
      qr: 'qr'
    }
  }
};

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ 
            headerShown: false 
          }}
        />
        <Stack.Screen 
          name="SplitBill" 
          component={SplitBillScreen} 
          options={{ 
            headerShown: false 
          }}
        />
        <Stack.Screen 
          name="ScanQR" 
          component={ScanQRScreen} 
          options={{ 
            headerShown: false
          }}
        />
        <Stack.Screen 
          name="PayContact" 
          component={PayContactScreen} 
          options={{ 
            headerShown: false
          }}
        />
        <Stack.Screen 
          name="PayPhone" 
          component={PayPhoneScreen} 
          options={{ 
            headerShown: false
          }}
        />
        <Stack.Screen 
          name="PayUPI" 
          component={PayUPIScreen} 
          options={{ 
            headerShown: false
          }}
        />
        {/* New screens added for additional functionality */}
        <Stack.Screen 
          name="BankTransfer" 
          component={BankTransferScreen} 
          options={{ 
            headerShown: false
          }}
        />
        <Stack.Screen 
          name="PayBills" 
          component={PayBillsScreen} 
          options={{ 
            headerShown: false
          }}
        />
        <Stack.Screen 
          name="MobileRecharge" 
          component={MobileRechargeScreen} 
          options={{ 
            headerShown: false
          }}
        />
      </Stack.Navigator>
    </>
  );
}

function App() {
  // Use NavigationIndependentTree to ensure this navigator is independent
  return (
    <NavigationIndependentTree>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </NavigationIndependentTree>
  );
}

// Home Screen Component
function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Icon name="magnify" size={22} color="#888" />
          <TextInput
            style={styles.searchInput}
            placeholder="Pay friends and merchants"
            placeholderTextColor="#888"
          />
        </View>
        <View style={styles.profileIcon}>
          <Text style={styles.profileLetter}>V</Text>
        </View>
      </View>

      {/* Banner Section */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.bannerSection}>
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerTitle}>Scan & pay any UPI QR</Text>
            <Text style={styles.bannerTitle}>with credit card</Text>
            <TouchableOpacity style={styles.bannerButton}>
              <Text style={styles.bannerButtonText}>Add RuPay card</Text>
              <Icon name="arrow-right" size={20} color="#000" />
            </TouchableOpacity>
          </View>
          <View style={styles.bannerImageContainer}>
            <Image
              source={{ uri: 'https://via.placeholder.com/150' }}
              style={styles.bannerImage}
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('ScanQR')}
            >
              <Icon name="qrcode-scan" size={24} color="#8ab4f8" />
              <Text style={styles.actionButtonText}>Scan any{'\n'}QR code</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('PayContact')}
            >
              <Icon name="account-multiple" size={24} color="#8ab4f8" />
              <Text style={styles.actionButtonText}>Pay{'\n'}contacts</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('PayPhone')}
            >
              <Icon name="phone" size={24} color="#8ab4f8" />
              <Text style={styles.actionButtonText}>Pay phone{'\n'}number</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('BankTransfer')}
            >
              <Icon name="bank" size={24} color="#8ab4f8" />
              <Text style={styles.actionButtonText}>Bank{'\n'}transfer</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.actionButtonsRow}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('PayUPI')}
            >
              <Icon name="at" size={24} color="#8ab4f8" />
              <Text style={styles.actionButtonText}>Pay UPI ID{'\n'}or number</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Icon name="account" size={24} color="#8ab4f8" />
              <Text style={styles.actionButtonText}>Self{'\n'}transfer</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('PayBills')}
            >
              <Icon name="file-document-outline" size={24} color="#8ab4f8" />
              <Text style={styles.actionButtonText}>Pay{'\n'}bills</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('MobileRecharge')}
            >
              <Icon name="cellphone" size={24} color="#8ab4f8" />
              <Text style={styles.actionButtonText}>Mobile{'\n'}recharge</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity style={styles.tapPayButton}>
            <Text style={styles.tapPayText}>Tap & Pay</Text>
            <Icon name="contactless-payment" size={16} color="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.upiLiteButton}>
            <Text style={styles.upiLiteText}>Activate UPI Lite</Text>
            <Icon name="plus-circle-outline" size={16} color="#fff" />
          </TouchableOpacity>
          
          <View style={styles.upiIdContainer}>
            <Text style={styles.upiIdText} numberOfLines={1}>
              UPI ID: vinayakpbhatia@okhdfc
            </Text>
          </View>
        </View>

        {/* People Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>People</Text>
          <View style={styles.contactsRow}>
            {['Group exp...', 'Sanika', 'init.io', 'Hrishikesh'].map((name, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.contactItem}
                onPress={() => {
                  if (index === 0) {
                    navigation.navigate('SplitBill');
                  }
                }}
              >
                <View style={styles.contactAvatar}>
                  <Text style={styles.contactAvatarText}>
                    {name.charAt(0)}
                  </Text>
                </View>
                <Text style={styles.contactName} numberOfLines={1}>
                  {name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <View style={styles.contactsRow}>
            {['Pccoe', 'santosh', 'Asim', 'More'].map((name, index) => (
              <TouchableOpacity key={index} style={styles.contactItem}>
                <View style={[styles.contactAvatar, name === 'More' && styles.moreAvatar]}>
                  {name === 'More' ? (
                    <Icon name="chevron-down" size={24} color="#888" />
                  ) : (
                    <Text style={styles.contactAvatarText}>
                      {name.charAt(0)}
                    </Text>
                  )}
                </View>
                <Text style={styles.contactName} numberOfLines={1}>
                  {name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Businesses Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.businessHeaderContainer}>
            <Text style={styles.sectionTitle}>Businesses</Text>
            <TouchableOpacity>
              <Text style={styles.exploreText}>Explore</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.businessesRow}>
            {['Zomato Ltd', 'Jio Prepaid...', 'Blinkit', 'More'].map((name, index) => (
              <TouchableOpacity key={index} style={styles.businessItem}>
                <View style={[
                  styles.businessLogo,
                  { backgroundColor: index === 0 ? '#e91e63' : 
                                     index === 1 ? '#ef5350' : 
                                     index === 2 ? '#e65100' : 'transparent' },
                  name === 'More' && styles.moreAvatar
                ]}>
                  {name === 'More' ? (
                    <Icon name="chevron-down" size={24} color="#888" />
                  ) : (
                    <Text style={styles.businessLogoText}>
                      {name.charAt(0)}
                    </Text>
                  )}
                </View>
                <Text style={styles.businessName} numberOfLines={1}>
                  {name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Split Bill Screen
function SplitBillScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(null);
  

  // Payment step sequence
  const steps = [
    "Calculating split amounts...",
    "Preparing request...",
    "Sending notifications...",
    "Finalizing request..."
  ];

  const handleSendRequest = () => {
    setLoading(true);
    setCurrentStep(0);
    
    // Simulate step progression with timeouts
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= steps.length - 1) {
          clearInterval(stepInterval);
          setTimeout(() => {
            setLoading(false);
            setShowConfirmation(true);
            Vibration.vibrate(100);
          }, 500);
          return prev;
        }
        return prev + 1;
      });
    }, 800);
  };

  const handleConfirm = () => {
    setShowConfirmation(false);
    // Show success message and navigate back
    showNotification("Split request sent successfully!");
    setTimeout(() => navigation.goBack(), 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <Icon name="dots-vertical" size={24} color="#fff" />
        </View>
      </View>

      {/* Amount Display */}
      <View style={styles.amountContainer}>
        <Text style={styles.amountLabel}>Total</Text>
        <Text style={styles.amountValue}>₹56</Text>
        <TouchableOpacity style={styles.purposeButton}>
          <Text style={styles.purposeButtonText}>What's this for?</Text>
        </TouchableOpacity>
      </View>

      {/* Split Options */}
      <View style={styles.splitOptionsContainer}>
        <TouchableOpacity style={[styles.splitOption, styles.splitOptionActive]}>
          <Icon name="account-multiple" size={24} color="#8ab4f8" />
          <Text style={styles.splitOptionTextActive}>Split evenly</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.splitOption}>
          <Icon name="calculator" size={24} color="#888" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.splitOption}>
          <Icon name="percent" size={24} color="#888" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.splitOption}>
          <Icon name="calculator-variant" size={24} color="#888" />
        </TouchableOpacity>
      </View>

      {/* Split People List */}
      <View style={styles.splitPeopleContainer}>
        <View style={styles.splitPersonRow}>
          <View style={styles.splitPersonLeft}>
            <TouchableOpacity style={styles.checkBoxActive}>
              <Icon name="check" size={16} color="#fff" />
            </TouchableOpacity>
            <View style={styles.splitPersonAvatar}>
              <Text style={styles.splitPersonAvatarText}>V</Text>
            </View>
            <Text style={styles.splitPersonName}>You</Text>
          </View>
          <Text style={styles.splitAmount}>₹18.66</Text>
        </View>

        <View style={styles.splitPersonRow}>
          <View style={styles.splitPersonLeft}>
            <TouchableOpacity style={styles.checkBoxActive}>
              <Icon name="check" size={16} color="#fff" />
            </TouchableOpacity>
            <View style={[styles.splitPersonAvatar, {backgroundColor: '#f44336'}]}>
              <Text style={styles.splitPersonAvatarText}>A</Text>
            </View>
            <Text style={styles.splitPersonName}>Anushka Shendge</Text>
          </View>
          <Text style={styles.splitAmount}>₹18.67</Text>
        </View>

        <View style={styles.splitPersonRow}>
          <View style={styles.splitPersonLeft}>
            <TouchableOpacity style={styles.checkBoxActive}>
              <Icon name="check" size={16} color="#fff" />
            </TouchableOpacity>
            <View style={styles.splitPersonCustomAvatar}>
              <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.avatarImage} />
            </View>
            <Text style={styles.splitPersonName}>Atharva Patil</Text>
          </View>
          <Text style={styles.splitAmount}>₹18.67</Text>
        </View>
      </View>

      {/* Send Request Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.sendRequestButton, loading && styles.disabledButton]}
          onPress={handleSendRequest}
          disabled={loading}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#000" size="small" />
              <Text style={styles.loadingText}>{steps[currentStep]}</Text>
            </View>
          ) : (
            <Text style={styles.sendRequestButtonText}>Send request</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmation}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowConfirmation(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconContainer}>
              <Icon name="check-circle" size={60} color="#4caf50" />
            </View>
            <Text style={styles.modalTitle}>Request Ready!</Text>
            <Text style={styles.modalText}>
              Your split request for ₹56 is ready to be sent to 2 contacts
            </Text>
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={handleConfirm}
            >
              <Text style={styles.modalButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function ScanQRScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await ExpoCamera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <ExpoCamera
        ref={cameraRef}
        style={{ flex: 1 }}
        type={ExpoCamera.Constants.Type.back}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
      >
        <View style={styles.scannerOverlay}>
          <View style={styles.qrFrame}>
            <View style={styles.cornerTL} />
            <View style={styles.cornerTR} />
            <View style={styles.cornerBL} />
            <View style={styles.cornerBR} />
          </View>
          <Text style={styles.scannerText}>Scan QR Code</Text>
        </View>
      </ExpoCamera>
    </View>
  );
}

// Pay Contact Screen
  // Reset scanner
  // const resetScanner = () => {
  //   setScanning(true);
  //   setShowPaymentModal(false);
  //   setPaymentData(null);
  //   setProcessStage(0);
  //   setPaymentStatus('processing');
  // };

  // // Process payment
  // const processPayment = async () => {
  //   setPaymentStatus('processing');
  //   for (let i = 0; i < processStages.length; i++) {
  //     setProcessStage(i);
  //     await new Promise(resolve => setTimeout(resolve, 1000));
  //   }
  //   setPaymentStatus('success');
  // };

  // const handleCloseModal = () => {
  //   setShowPaymentModal(false);
  //   if (paymentStatus === 'success') {
  //     showNotification("Payment successful!");
  //     navigation.goBack();
  //   } else {
  //     setScanning(true);
  //   }
  // };

  // // Permission handling
  // if (!permission) {
  //   return <View />;
  // }

  // if (!permission.granted) {
  //   return (
  //     <View style={styles.container}>
  //       <Text style={styles.permissionText}>
  //         We need your permission to use the camera
  //       </Text>
  //       <TouchableOpacity
  //         style={styles.permissionButton}
  //         onPress={requestPermission}
  //       >
  //         <Text style={styles.permissionButtonText}>Grant Permission</Text>
  //       </TouchableOpacity>
  //     </View>
  //   );
  // }

// Pay Contact Screen
function PayContactScreen({ navigation }) {
  const [selectedContact, setSelectedContact] = useState(null);
  const [amount, setAmount] = useState('');
  const [showAmountModal, setShowAmountModal] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  const contacts = [
    { name: 'Group expenses', upi: 'group@okhdfc', image: null },
    { name: 'Anushka Shendge', upi: 'anushka@okhdfc', image: null },
    { name: 'Atharva Patil', upi: 'atharva@ybl', image: 'https://via.placeholder.com/150' },
    { name: 'Hrishikesh', upi: 'hrishi@paytm', image: null },
    { name: 'Sanika', upi: 'sanika@okaxis', image: null },
    { name: 'Santosh', upi: 'santosh@okicici', image: null }
  ];

  const handleContactSelect = (contact) => {
    setSelectedContact(contact);
    setShowAmountModal(true);
  };

  const handlePayment = () => {
    if (!amount || isNaN(parseFloat(amount))) {
      showNotification("Please enter a valid amount");
      return;
    }
    
    setProcessingPayment(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setProcessingPayment(false);
      setPaymentComplete(true);
      
      // Show success and navigate back after delay
      setTimeout(() => {
        setShowAmountModal(false);
        setPaymentComplete(false);
        showNotification(`₹${amount} sent to ${selectedContact.name}`);
        navigation.goBack();
      }, 2000);
    }, 3000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Pay Contacts</Text>
        <Icon name="magnify" size={24} color="#fff" />
      </View>

      <View style={styles.contactListContainer}>
        <Text style={styles.contactHeaderText}>Frequent contacts</Text>
        
        {contacts.map((contact, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.contactListItem}
            onPress={() => handleContactSelect(contact)}
          >
            {contact.image ? (
              <View style={styles.contactListCustomAvatar}>
                <Image source={{ uri: contact.image }} style={styles.avatarImage} />
              </View>
            ) : (
              <View style={[styles.contactListAvatar, { 
                backgroundColor: index % 3 === 0 ? '#4caf50' : index % 3 === 1 ? '#f44336' : '#2196f3' 
              }]}>
                <Text style={styles.contactListAvatarText}>{contact.name.charAt(0)}</Text>
              </View>
            )}
            <View style={styles.contactListDetails}>
              <Text style={styles.contactListName}>{contact.name}</Text>
              <Text style={styles.contactListUPI}>UPI: {contact.upi}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Amount Input Modal */}
      <Modal
        visible={showAmountModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => !processingPayment && setShowAmountModal(false)}
      >
        <View style={styles.amountModalOverlay}>
          <View style={styles.amountModalContent}>
            {selectedContact && !paymentComplete && (
              <>
                <View style={styles.selectedContactHeader}>
                  <View style={styles.selectedContactAvatar}>
                    <Text style={styles.selectedContactInitial}>
                      {selectedContact.name.charAt(0)}
                    </Text>
                  </View>
                  <Text style={styles.selectedContactName}>{selectedContact.name}</Text>
                  <Text style={styles.selectedContactUpi}>{selectedContact.upi}</Text>
                </View>
                
                <View style={styles.amountInputContainer}>
                  <Text style={styles.rupeesSymbol}>₹</Text>
                  <TextInput
                    style={styles.amountInput}
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor="#888"
                    editable={!processingPayment}
                    autoFocus
                  />
                </View>
                
                <Text style={styles.amountHint}>
                  Add a note (optional)
                </Text>
                
                <TouchableOpacity 
                  style={[
                    styles.payNowButton,
                    (!amount || processingPayment) && styles.disabledButton
                  ]}
                  onPress={handlePayment}
                  disabled={!amount || processingPayment}
                >
                  {processingPayment ? (
                    <View style={styles.payingContainer}>
                      <ActivityIndicator color="#000" />
                      <Text style={styles.payingText}>Processing payment...</Text>
                    </View>
                  ) : (
                    <Text style={styles.payNowText}>Pay Now</Text>
                  )}
                </TouchableOpacity>
              </>
            )}
            
            {paymentComplete && (
              <View style={styles.paymentSuccessContainer}>
                <Icon name="check-circle" size={80} color="#4caf50" />
                <Text style={styles.paymentSuccessText}>
                  ₹{amount} paid successfully!
                </Text>
                <Text style={styles.paymentRecipient}>
                  to {selectedContact?.name}
                </Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Pay Phone Number Screen
function PayPhoneScreen({ navigation }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState(null);

  const handleVerify = () => {
    if (phoneNumber.length !== 10 || isNaN(Number(phoneNumber))) {
      setError("Please enter a valid 10-digit number");
      return;
    }
    
    setError(null);
    setVerifying(true);
    
    // Simulate API verification
    setTimeout(() => {
      // Simulate 80% success rate
      if (Math.random() > 0.2) {
        setUserDetails({
          name: "Rohit Sharma",
          upiId: `${phoneNumber}@okhdfc`,
          bankAccount: "XXXX1234"
        });
        setVerified(true);
      } else {
        setError("No UPI ID found for this number");
      }
      setVerifying(false);
    }, 2000);
  };
  
  const handlePayNow = () => {
    // Navigate to payment screen with user details
    navigation.navigate('PayContact');
    
    // Show toast
    showNotification(`Redirecting to pay ${userDetails.name}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Pay to Phone Number</Text>
        <View style={{width: 24}} />
      </View>

      <View style={styles.phoneInputContainer}>
        <Text style={styles.phoneInputLabel}>Enter phone number</Text>
        <View style={styles.phoneInputField}>
          <Text style={styles.phonePrefix}>+91</Text>
          <TextInput
            style={styles.phoneInputText}
            placeholder="10-digit mobile number"
            placeholderTextColor="#888"
            keyboardType="phone-pad"
            maxLength={10}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            editable={!verifying && !verified}
          />
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
        <Text style={styles.phoneInputHint}>This number should be registered with UPI</Text>
      </View>

      {verified && userDetails && (
        <View style={styles.verifiedUserContainer}>
          <Icon name="check-circle" size={24} color="#4caf50" />
          <View style={styles.verifiedUserDetails}>
            <Text style={styles.verifiedUserName}>{userDetails.name}</Text>
            <Text style={styles.verifiedUserUpi}>{userDetails.upiId}</Text>
          </View>
        </View>
      )}

      <View style={styles.buttonContainer}>
        {!verified ? (
          <TouchableOpacity 
            style={[
              styles.verifyButton, 
              (phoneNumber.length !== 10 || verifying) && styles.disabledButton
            ]}
            onPress={handleVerify}
            disabled={phoneNumber.length !== 10 || verifying}
          >
            {verifying ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="#000" size="small" />
                <Text style={styles.loadingText}>Verifying...</Text>
              </View>
            ) : (
              <Text style={styles.verifyButtonText}>Verify and Proceed</Text>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={styles.verifyButton}
            onPress={handlePayNow}
          >
            <Text style={styles.verifyButtonText}>Pay Now</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

// Pay UPI ID Screen
function PayUPIScreen({ navigation }) {
  const [upiId, setUpiId] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState(null);
  const [recentUpiList, setRecentUpiList] = useState(['friend@okhdfc', 'business@ybl', '9876543210@paytm']);

  const handleVerify = () => {
    if (!upiId || !upiId.includes('@')) {
      setError("Please enter a valid UPI ID");
      return;
    }
    
    setError(null);
    setVerifying(true);
    
    // Simulate API verification
    setTimeout(() => {
      // Simulate 80% success rate
      if (Math.random() > 0.2) {
        const name = upiId.split('@')[0].charAt(0).toUpperCase() + 
                    upiId.split('@')[0].slice(1);
        setUserDetails({
          name: name,
          upiId: upiId,
          verified: true
        });
        
        // Add to recent list if not already there
        if (!recentUpiList.includes(upiId)) {
          setRecentUpiList(prev => [upiId, ...prev].slice(0, 5));
        }
        
        setVerified(true);
      } else {
        setError("Invalid UPI ID or user not found");
      }
      setVerifying(false);
    }, 1800);
  };

  const selectRecentUpi = (upi) => {
    setUpiId(upi);
    setError(null);
    setVerified(false);
    setUserDetails(null);
  };
  
  const handlePayNow = () => {
    // Navigate to payment with details
    navigation.navigate('PayContact');
    
    // Show toast
    showNotification(`Redirecting to pay ${userDetails.name}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Pay to UPI ID or number</Text>
        <View style={{width: 24}} />
      </View>

      <View style={styles.upiInputContainer}>
        <Text style={styles.upiInputLabel}>Enter UPI ID or number</Text>
        <View style={styles.upiInputField}>
          <TextInput
            style={styles.upiInputText}
            placeholder="example@upi"
            placeholderTextColor="#888"
            value={upiId}
            onChangeText={setUpiId}
            editable={!verifying && !verified}
            autoFocus
          />
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
        <Text style={styles.upiInputHint}>Enter any UPI ID like name@upi or phone number</Text>
      </View>

      {verified && userDetails && (
        <View style={styles.verifiedUserContainer}>
          <Icon name="check-circle" size={24} color="#4caf50" />
          <View style={styles.verifiedUserDetails}>
            <Text style={styles.verifiedUserName}>{userDetails.name}</Text>
            <Text style={styles.verifiedUserUpi}>{userDetails.upiId}</Text>
          </View>
        </View>
      )}

      <View style={styles.recentUpiSection}>
        <Text style={styles.recentUpiTitle}>RECENT</Text>
        <View style={styles.recentUpiList}>
          {recentUpiList.map((upi, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.recentUpiItem}
              onPress={() => selectRecentUpi(upi)}
            >
              <Icon name="clock-outline" size={20} color="#888" />
              <Text style={styles.recentUpiText}>{upi}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.buttonContainer}>
        {!verified ? (
          <TouchableOpacity 
            style={[
              styles.verifyButton, 
              (!upiId || verifying) && styles.disabledButton
            ]}
            onPress={handleVerify}
            disabled={!upiId || verifying}
          >
            {verifying ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="#000" size="small" />
                <Text style={styles.loadingText}>Verifying...</Text>
              </View>
            ) : (
              <Text style={styles.verifyButtonText}>Verify and Pay</Text>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={styles.verifyButton}
            onPress={handlePayNow}
          >
            <Text style={styles.verifyButtonText}>Pay Now</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

// Bank Transfer Screen (New)
function BankTransferScreen({ navigation }) {
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [selectedBank, setSelectedBank] = useState(null);
  const [transferAmount, setTransferAmount] = useState('');
  const [recipientAccount, setRecipientAccount] = useState('');
  const [recipientIFSC, setRecipientIFSC] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [purpose, setPurpose] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const bankAccounts = [
    { id: 1, bankName: 'State Bank of India', accountNumber: 'XXXX1234', balance: 45000, ifsc: 'SBIN0001234' },
    { id: 2, bankName: 'HDFC Bank', accountNumber: 'XXXX5678', balance: 28500, ifsc: 'HDFC0001234' }
  ];

  const popularBanks = [
    { id: 1, name: 'State Bank of India', icon: 'bank' },
    { id: 2, name: 'HDFC Bank', icon: 'bank' },
    { id: 3, name: 'ICICI Bank', icon: 'bank' },
    { id: 4, name: 'Axis Bank', icon: 'bank' },
    { id: 5, name: 'Punjab National Bank', icon: 'bank' }
  ];
  
  const handleContinue = () => {
    if (!selectedAccount || !transferAmount || !recipientAccount || !recipientIFSC || !recipientName) {
      showNotification("Please fill all required fields");
      return;
    }
    
    setShowConfirmation(true);
  };
  
  const handleTransfer = () => {
    setShowConfirmation(false);
    setIsProcessing(true);
    
    // Simulate transfer process
    setTimeout(() => {
      setIsProcessing(false);
      showNotification(`₹${transferAmount} transferred successfully!`);
      navigation.goBack();
    }, 2500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Bank Transfer</Text>
        <View style={{width: 24}}></View>
      </View>
      
      <ScrollView contentContainerStyle={styles.transferFormContainer}>
        {/* Select Source Account */}
        <Text style={styles.transferSectionTitle}>From Account</Text>
        
        {bankAccounts.map(account => (
          <TouchableOpacity
            key={account.id}
            style={[
              styles.accountCard,
              selectedAccount?.id === account.id && styles.selectedAccountCard
            ]}
            onPress={() => setSelectedAccount(account)}
          >
            <View style={styles.accountDetails}>
              <Text style={styles.bankName}>{account.bankName}</Text>
              <Text style={styles.accountNumber}>{account.accountNumber}</Text>
              <Text style={styles.accountBalance}>Balance: ₹{account.balance.toLocaleString()}</Text>
            </View>
            {selectedAccount?.id === account.id && (
              <Icon name="check-circle" size={24} color="#4caf50" />
            )}
          </TouchableOpacity>
        ))}
        
        {/* Recipient Details */}
        <Text style={[styles.transferSectionTitle, {marginTop: 20}]}>To Account</Text>
        
        <Text style={styles.inputLabel}>Recipient Bank</Text>
        <TouchableOpacity 
          style={styles.bankSelector}
          onPress={() => {
            // In a full app, this would open a bank selection modal
            setSelectedBank(popularBanks[0]);
          }}
        >
          <Text style={selectedBank ? styles.selectedBankText : styles.placeholderText}>
            {selectedBank ? selectedBank.name : "Select recipient's bank"}
          </Text>
          <Icon name="chevron-down" size={24} color="#888" />
        </TouchableOpacity>
        
        <Text style={styles.inputLabel}>Account Number</Text>
        <TextInput
          style={styles.transferInput}
          placeholder="Enter account number"
          placeholderTextColor="#888"
          value={recipientAccount}
          onChangeText={setRecipientAccount}
          keyboardType="number-pad"
        />
        
        <Text style={styles.inputLabel}>IFSC Code</Text>
        <TextInput
          style={styles.transferInput}
          placeholder="Enter IFSC code"
          placeholderTextColor="#888"
          value={recipientIFSC}
          onChangeText={setRecipientIFSC}
          autoCapitalize="characters"
        />
        
        <Text style={styles.inputLabel}>Recipient Name</Text>
        <TextInput
          style={styles.transferInput}
          placeholder="Enter recipient name"
          placeholderTextColor="#888"
          value={recipientName}
          onChangeText={setRecipientName}
        />
        
        <Text style={styles.inputLabel}>Amount (₹)</Text>
        <TextInput
          style={styles.transferInput}
          placeholder="Enter amount"
          placeholderTextColor="#888"
          value={transferAmount}
          onChangeText={setTransferAmount}
          keyboardType="numeric"
        />
        
        <Text style={styles.inputLabel}>Purpose (Optional)</Text>
        <TextInput
          style={styles.transferInput}
          placeholder="e.g. Rent, Family support"
          placeholderTextColor="#888"
          value={purpose}
          onChangeText={setPurpose}
        />
        
        <TouchableOpacity 
          style={[styles.continueButton, (!selectedAccount || !transferAmount) && styles.disabledButton]}
          onPress={handleContinue}
          disabled={!selectedAccount || !transferAmount}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
      
      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmation}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowConfirmation(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmationModal}>
            <Text style={styles.confirmationTitle}>Confirm Transfer</Text>
            
            <View style={styles.confirmationDetails}>
              <View style={styles.confirmationRow}>
                <Text style={styles.confirmationLabel}>From:</Text>
                <Text style={styles.confirmationValue}>{selectedAccount?.bankName}</Text>
              </View>
              <View style={styles.confirmationRow}>
                <Text style={styles.confirmationLabel}>To:</Text>
                <Text style={styles.confirmationValue}>{recipientName}</Text>
              </View>
              <View style={styles.confirmationRow}>
                <Text style={styles.confirmationLabel}>Amount:</Text>
                <Text style={styles.confirmationValue}>₹{transferAmount}</Text>
              </View>
            </View>
            
            <View style={styles.confirmationButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowConfirmation(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.confirmButton}
                onPress={handleTransfer}
              >
                <Text style={styles.confirmButtonText}>Transfer Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Processing Modal */}
      <Modal
        visible={isProcessing}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.processingModal}>
            <ActivityIndicator size="large" color="#8ab4f8" />
            <Text style={styles.processingText}>Processing transfer...</Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Pay Bills Screen (New)
function PayBillsScreen({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const billCategories = [
    { id: 'electricity', name: 'Electricity', icon: 'flash' },
    { id: 'water', name: 'Water', icon: 'water' },
    { id: 'gas', name: 'Gas', icon: 'gas-cylinder' },
    { id: 'internet', name: 'Internet', icon: 'wifi' },
    { id: 'dth', name: 'DTH', icon: 'satellite-variant' },
    { id: 'landline', name: 'Landline', icon: 'phone-classic' },
    { id: 'credit_card', name: 'Credit Card', icon: 'credit-card' },
    { id: 'insurance', name: 'Insurance', icon: 'shield-check' }
  ];
  
  const providers = {
    electricity: [
      { id: 'e1', name: 'State Electricity Board', logo: null },
      { id: 'e2', name: 'Adani Electricity', logo: null },
      { id: 'e3', name: 'Tata Power', logo: null }
    ],
    water: [
      { id: 'w1', name: 'Municipal Water Supply', logo: null },
      { id: 'w2', name: 'City Water Utility', logo: null }
    ],
    gas: [
      { id: 'g1', name: 'Indane Gas', logo: null },
      { id: 'g2', name: 'HP Gas', logo: null },
      { id: 'g3', name: 'Bharat Gas', logo: null }
    ],
    internet: [
      { id: 'i1', name: 'Airtel Broadband', logo: null },
      { id: 'i2', name: 'Jio Fiber', logo: null },
      { id: 'i3', name: 'BSNL Broadband', logo: null }
    ],
    dth: [
      { id: 'd1', name: 'Tata Sky', logo: null },
      { id: 'd2', name: 'Airtel DTH', logo: null },
      { id: 'd3', name: 'Dish TV', logo: null }
    ],
    landline: [
      { id: 'l1', name: 'BSNL Landline', logo: null },
      { id: 'l2', name: 'Airtel Landline', logo: null }
    ],
    credit_card: [
      { id: 'c1', name: 'HDFC Credit Card', logo: null },
      { id: 'c2', name: 'SBI Credit Card', logo: null },
      { id: 'c3', name: 'ICICI Credit Card', logo: null }
    ],
    insurance: [
      { id: 'in1', name: 'LIC', logo: null },
      { id: 'in2', name: 'HDFC Life', logo: null },
      { id: 'in3', name: 'Max Life Insurance', logo: null }
    ]
  };
  
  const filteredProviders = selectedCategory ? 
    providers[selectedCategory.id].filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) : [];
  
  const handleProviderSelect = (provider) => {
    // In a complete app, this would navigate to a bill details screen
    showNotification(`Selected ${provider.name}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Pay Bills</Text>
        <View style={{width: 24}}></View>
      </View>
      
      <View style={styles.billSearchContainer}>
        <Icon name="magnify" size={22} color="#888" />
        <TextInput
          style={styles.billSearchInput}
          placeholder="Search for a biller"
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      {!selectedCategory ? (
        <ScrollView contentContainerStyle={styles.billCategoriesContainer}>
          <Text style={styles.billSectionTitle}>Select a category</Text>
          
          <View style={styles.billCategoriesGrid}>
            {billCategories.map(category => (
              <TouchableOpacity 
                key={category.id}
                style={styles.billCategoryCard}
                onPress={() => setSelectedCategory(category)}
              >
                <View style={styles.billCategoryIconContainer}>
                  <Icon name={category.icon} size={32} color="#8ab4f8" />
                </View>
                <Text style={styles.billCategoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <View style={styles.recentBillsContainer}>
            <Text style={styles.billSectionTitle}>Recent bills</Text>
            
            <TouchableOpacity style={styles.recentBillCard}>
              <View style={[styles.billProviderLogo, {backgroundColor: '#f44336'}]}>
                <Text style={styles.billProviderLogoText}>T</Text>
              </View>
              <View style={styles.recentBillDetails}>
                <Text style={styles.recentBillName}>Tata Power</Text>
                <Text style={styles.recentBillAccount}>Consumer No: 123456789</Text>
              </View>
              <View style={styles.recentBillAmount}>
                <Text style={styles.recentBillText}>Last paid</Text>
                <Text style={styles.recentBillValue}>₹1,450</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.recentBillCard}>
              <View style={[styles.billProviderLogo, {backgroundColor: '#4caf50'}]}>
                <Text style={styles.billProviderLogoText}>J</Text>
              </View>
              <View style={styles.recentBillDetails}>
                <Text style={styles.recentBillName}>Jio Fiber</Text>
                <Text style={styles.recentBillAccount}>Account No: JF98765432</Text>
              </View>
              <View style={styles.recentBillAmount}>
                <Text style={styles.recentBillText}>Last paid</Text>
                <Text style={styles.recentBillValue}>₹999</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <View style={{flex: 1}}>
          <View style={styles.categoryHeaderContainer}>
            <Text style={styles.categoryHeaderTitle}>{selectedCategory.name} Bills</Text>
            <TouchableOpacity 
              style={styles.backToCategories}
              onPress={() => setSelectedCategory(null)}
            >
              <Text style={styles.backToCategoriesText}>All categories</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={filteredProviders}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <TouchableOpacity 
                style={styles.providerCard}
                onPress={() => handleProviderSelect(item)}
              >
                <View style={styles.providerLogo}>
                  <Text style={styles.providerLogoText}>{item.name.charAt(0)}</Text>
                </View>
                <Text style={styles.providerName}>{item.name}</Text>
                <Icon name="chevron-right" size={24} color="#888" />
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.providersListContainer}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

// Mobile Recharge Screen (New)
function MobileRechargeScreen({ navigation }) {
  const [mobileNumber, setMobileNumber] = useState('');
  const [selectedOperator, setSelectedOperator] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [activeTab, setActiveTab] = useState('popular');
  
  const operators = [
    { id: 1, name: 'Jio', logo: null, color: '#0f3cc9' },
    { id: 2, name: 'Airtel', logo: null, color: '#ff0000' },
    { id: 3, name: 'Vi', logo: null, color: '#ed9121' },
    { id: 4, name: 'BSNL', logo: null, color: '#2e8b57' }
  ];
  
  const plans = {
    popular: [
      { id: 'p1', amount: 239, validity: '28 days', data: '1.5GB/day', description: 'Unlimited calls, 100 SMS/day' },
      { id: 'p2', amount: 479, validity: '56 days', data: '1.5GB/day', description: 'Unlimited calls, 100 SMS/day' },
      { id: 'p3', amount: 666, validity: '84 days', data: '1.5GB/day', description: 'Unlimited calls, 100 SMS/day' }
    ],
    data: [
      { id: 'd1', amount: 199, validity: '28 days', data: '2GB/day', description: 'Unlimited calls, 100 SMS/day' },
      { id: 'd2', amount: 299, validity: '28 days', data: '3GB/day', description: 'Unlimited calls, 100 SMS/day' },
      { id: 'd3', amount: 399, validity: '56 days', data: '3GB/day', description: 'Unlimited calls, 100 SMS/day' }
    ],
    entertainment: [
      { id: 'e1', amount: 499, validity: '28 days', data: '2GB/day', description: 'Unlimited calls, Free Netflix' },
      { id: 'e2', amount: 599, validity: '56 days', data: '2GB/day', description: 'Unlimited calls, Free Disney+ Hotstar' }
    ]
  };
  
  const handleNumberSubmit = () => {
    if (mobileNumber.length !== 10) {
      showNotification("Please enter a valid 10-digit number");
      return;
    }
    
    // Auto-detect operator (in a real app would call an API)
    setSelectedOperator(operators[0]);
  };
  
  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
  };
  
  const handleRecharge = () => {
    if (!selectedPlan) {
      showNotification("Please select a plan");
      return;
    }
    
    // In a complete app, this would navigate to payment confirmation
    showNotification(`Recharge successful for ₹${selectedPlan.amount}`);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Mobile Recharge</Text>
        <TouchableOpacity>
          <Icon name="history" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      
      <ScrollView contentContainerStyle={styles.rechargeContainer}>
        <View style={styles.numberInputContainer}>
          <Text style={styles.inputLabel}>Mobile Number</Text>
          <View style={styles.numberInputWrapper}>
            <TextInput
              style={styles.numberInput}
              placeholder="Enter 10-digit mobile number"
              placeholderTextColor="#888"
              value={mobileNumber}
              onChangeText={setMobileNumber}
              keyboardType="phone-pad"
              maxLength={10}
            />
            {mobileNumber.length === 10 && (
              <TouchableOpacity 
                style={styles.detectOperatorButton}
                onPress={handleNumberSubmit}
              >
                <Text style={styles.detectOperatorText}>Detect Operator</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        {!selectedOperator ? (
          <View style={styles.operatorSelectionContainer}>
            <Text style={styles.rechargeLabel}>Select Operator</Text>
            <View style={styles.operatorsGrid}>
              {operators.map(operator => (
                <TouchableOpacity 
                  key={operator.id}
                  style={styles.operatorCard}
                  onPress={() => setSelectedOperator(operator)}
                >
                  <View 
                    style={[
                      styles.operatorLogo, 
                      {backgroundColor: operator.color}
                    ]}
                  >
                    <Text style={styles.operatorLogoText}>{operator.name.charAt(0)}</Text>
                  </View>
                  <Text style={styles.operatorName}>{operator.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.planSelectionContainer}>
            <View style={styles.selectedOperatorBar}>
              <View 
                style={[
                  styles.selectedOperatorLogo, 
                  {backgroundColor: selectedOperator.color}
                ]}
              >
                <Text style={styles.operatorLogoText}>{selectedOperator.name.charAt(0)}</Text>
              </View>
              <Text style={styles.selectedOperatorName}>{selectedOperator.name}</Text>
              <TouchableOpacity 
                style={styles.changeButton}
                onPress={() => setSelectedOperator(null)}
              >
                <Text style={styles.changeButtonText}>Change</Text>
              </TouchableOpacity>
            </View>
            
            <Text style={styles.rechargeLabel}>Select a plan</Text>
            
            <View style={styles.planTabsContainer}>
              <TouchableOpacity 
                style={[styles.planTab, activeTab === 'popular' && styles.activeTab]}
                onPress={() => setActiveTab('popular')}
              >
                <Text style={[styles.planTabText, activeTab === 'popular' && styles.activeTabText]}>
                  Popular
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.planTab, activeTab === 'data' && styles.activeTab]}
                onPress={() => setActiveTab('data')}
              >
                <Text style={[styles.planTabText, activeTab === 'data' && styles.activeTabText]}>
                  Data
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.planTab, activeTab === 'entertainment' && styles.activeTab]}
                onPress={() => setActiveTab('entertainment')}
              >
                <Text style={[styles.planTabText, activeTab === 'entertainment' && styles.activeTabText]}>
                  Entertainment
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.plansContainer}>
              {plans[activeTab].map(plan => (
                <TouchableOpacity 
                  key={plan.id}
                  style={[
                    styles.planCard,
                    selectedPlan?.id === plan.id && styles.selectedPlanCard
                  ]}
                  onPress={() => handlePlanSelect(plan)}
                >
                  <View style={styles.planDetails}>
                    <View style={styles.planHeader}>
                      <Text style={styles.planAmount}>₹{plan.amount}</Text>
                      <Text style={styles.planValidity}>{plan.validity}</Text>
                    </View>
                    <Text style={styles.planData}>{plan.data}</Text>
                    <Text style={styles.planDescription}>{plan.description}</Text>
                  </View>
                  {selectedPlan?.id === plan.id && (
                    <Icon name="check-circle" size={24} color="#4caf50" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
            
            <TouchableOpacity 
              style={[styles.rechargeButton, !selectedPlan && styles.disabledButton]}
              onPress={handleRecharge}
              disabled={!selectedPlan}
            >
              <Text style={styles.rechargeButtonText}>
                Recharge for ₹{selectedPlan ? selectedPlan.amount : '0'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// Helper function for notifications
const showNotification = (message) => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    Alert.alert('', message);
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  screenTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: '#fff',
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1e8e3e',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  profileLetter: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  bannerSection: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 16,
  },
  bannerTextContainer: {
    flex: 1,
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  bannerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8ab4f8',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  bannerButtonText: {
    color: '#000',
    fontWeight: '500',
    marginRight: 4,
  },
  bannerImageContainer: {
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  actionButtonsContainer: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 20,
  },
  tapPayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  tapPayText: {
    color: '#fff',
    marginRight: 4,
  },
  upiLiteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderColor: '#444',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  upiLiteText: {
    color: '#fff',
    marginRight: 4,
  },
  upiIdContainer: {
    flex: 1,
  },
  upiIdText: {
    color: '#888',
    fontSize: 12,
  },
  sectionContainer: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 16,
  },
  contactsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  contactItem: {
    alignItems: 'center',
    width: '22%',
  },
  contactAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4285f4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  contactAvatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  contactName: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
  moreAvatar: {
    backgroundColor: '#222',
  },
  businessHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  exploreText: {
    color: '#8ab4f8',
    fontSize: 14,
  },
  businessesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  businessItem: {
    alignItems: 'center',
    width: '22%',
  },
  businessLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  businessLogoText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  businessName: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
  amountContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  amountLabel: {
    color: '#888',
    fontSize: 16,
  },
  amountValue: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '500',
    marginVertical: 8,
  },
  purposeButton: {
    backgroundColor: '#222',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  purposeButtonText: {
    color: '#8ab4f8',
  },
  splitOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
    marginHorizontal: 16,
  },
  splitOption: {
    alignItems: 'center',
    padding: 8,
  },
  splitOptionActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#8ab4f8',
  },
  splitOptionTextActive: {
    color: '#8ab4f8',
    marginTop: 4,
  },
  splitPeopleContainer: {
    marginTop: 16,
    marginHorizontal: 16,
  },
  splitPersonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  splitPersonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkBoxActive: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#8ab4f8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  splitPersonAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4285f4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  splitPersonCustomAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 12,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  splitPersonAvatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  splitPersonName: {
    color: '#fff',
    fontSize: 16,
  },
  splitAmount: {
    color: '#fff',
    fontSize: 16,
  },
  buttonContainer: {
    padding: 16,
    marginTop: 'auto',
  },
  sendRequestButton: {
    backgroundColor: '#8ab4f8',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 24,
  },
  sendRequestButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
  },
  scannerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrFrame: {
    width: 240,
    height: 240,
    position: 'relative',
  },
  cornerTL: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 30,
    height: 30,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#8ab4f8',
  },
  cornerTR: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 30,
    height: 30,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: '#8ab4f8',
  },
  cornerBL: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 30,
    height: 30,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#8ab4f8',
  },
  cornerBR: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: '#8ab4f8',
  },
  scannerText: {
    color: '#fff',
    marginTop: 24,
    fontSize: 16,
  },
  scanOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 24,
  },
  scanOption: {
    alignItems: 'center',
  },
  scanOptionText: {
    color: '#fff',
    marginTop: 8,
  },
  contactListContainer: {
    marginTop: 16,
  },
  contactHeaderText: {
    color: '#888',
    fontSize: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  contactListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  contactListAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  contactListAvatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  contactListDetails: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
    paddingBottom: 12,
  },
  contactListName: {
    color: '#fff',
    fontSize: 16,
  },
  contactListUPI: {
    color: '#888',
    fontSize: 14,
    marginTop: 4,
  },
  phoneInputContainer: {
    marginHorizontal: 16,
    marginTop: 24,
  },
  phoneInputLabel: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
  },
  phoneInputField: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#8ab4f8',
    paddingBottom: 8,
  },
  phonePrefix: {
    color: '#fff',
    fontSize: 16,
    marginRight: 8,
  },
  phoneInputText: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  phoneInputHint: {
    color: '#888',
    fontSize: 12,
    marginTop: 8,
  },
  verifyButton: {
    backgroundColor: '#8ab4f8',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 24,
  },
  verifyButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
  },
  upiInputContainer: {
    marginHorizontal: 16,
    marginTop: 24,
  },
  upiInputLabel: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
  },
  upiInputField: {
    borderBottomWidth: 1,
    borderBottomColor: '#8ab4f8',
    paddingBottom: 8,
  },
  upiInputText: {
    color: '#fff',
    fontSize: 16,
  },
  upiInputHint: {
    color: '#888',
    fontSize: 12,
    marginTop: 8,
  },
  recentUpiSection: {
    marginTop: 24,
    marginHorizontal: 16,
  },
  recentUpiTitle: {
    color: '#888',
    fontSize: 12,
    marginBottom: 12,
  },
  recentUpiList: {
    borderTopWidth: 1,
    borderTopColor: '#222',
  },
  recentUpiItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  recentUpiText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 12,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#000',
    marginLeft: 8,
    fontSize: 14,
  },
  disabledButton: {
    opacity: 0.7,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    alignItems: 'center',
  },
  modalIconContainer: {
    marginBottom: 16,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  modalText: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#8ab4f8',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 8,
  },
  modalButtonText: {
    color: '#000',
    fontWeight: '500',
    fontSize: 16,
  },
  paymentModalOverlay: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'flex-end',
  },
  paymentModalContent: {
    backgroundColor: '#111',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: Dimensions.get('window').height * 0.6,
  },
  merchantSection: {
    alignItems: 'center',
    marginBottom: 30,
    paddingTop: 20,
  },
  merchantLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f44336',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  merchantLogoText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  merchantName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  merchantUpi: {
    color: '#888',
    fontSize: 14,
    marginBottom: 16,
  },
  paymentAmount: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '700',
  },
  paymentStatusSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
    flex: 1,
  },
  processingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
  },
  successText: {
    color: '#4caf50',
    fontSize: 24,
    fontWeight: '600',
    marginTop: 16,
  },
  successAmount: {
    color: '#fff',
    fontSize: 20,
    marginTop: 8,
  },
  failedText: {
    color: '#f44336',
    fontSize: 24,
    fontWeight: '600',
    marginTop: 16,
  },
  failedReason: {
    color: '#ccc',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  paymentActionButtons: {
    marginTop: 'auto',
    paddingTop: 16,
  },
  cancelText: {
    color: '#888',
    textAlign: 'center',
  },
  doneButton: {
    backgroundColor: '#8ab4f8',
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  failedButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tryAgainButton: {
    backgroundColor: '#8ab4f8',
    borderRadius: 24,
    paddingVertical: 12,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  tryAgainText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#333',
    borderRadius: 24,
    paddingVertical: 12,
    flex: 1,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  contactListCustomAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    marginRight: 16,
  },
  amountModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'flex-end',
  },
  amountModalContent: {
    backgroundColor: '#111',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
  },
  selectedContactHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  selectedContactAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4285f4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  selectedContactInitial: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
  },
  selectedContactName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  selectedContactUpi: {
    color: '#888',
    fontSize: 14,
    marginTop: 4,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  rupeesSymbol: {
    color: '#fff',
    fontSize: 40,
    fontWeight: '300',
    marginRight: 8,
  },
  amountInput: {
    color: '#fff',
    fontSize: 40,
    fontWeight: '400',
    minWidth: 100,
    textAlign: 'center',
  },
  amountHint: {
    color: '#8ab4f8',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 30,
  },
  payNowButton: {
    backgroundColor: '#8ab4f8',
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
  },
  payNowText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  payingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  payingText: {
    color: '#000',
    marginLeft: 8,
  },
  paymentSuccessContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  paymentSuccessText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
    marginTop: 16,
  },
  paymentRecipient: {
    color: '#ccc',
    fontSize: 16,
    marginTop: 8,
  },
  errorText: {
    color: '#f44336',
    fontSize: 12,
    marginTop: 4,
  },
  verifiedUserContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 24,
    padding: 16,
    backgroundColor: '#222',
    borderRadius: 12,
  },
  verifiedUserDetails: {
    marginLeft: 12,
  },
  verifiedUserName: {
    color: '#fff',
    fontSize: 16,
  },
  verifiedUserUpi: {
    color: '#888',
    fontSize: 12,
  },
  cameraContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
  },
  scannerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  permissionButton: {
    backgroundColor: '#8ab4f8',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  permissionButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
  },
  payButton: {
    backgroundColor: '#8ab4f8',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 20,
  },
  payButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  mockScannerContainer: {
    flex: 1,
    backgroundColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
  },
  simulateScanButton: {
    backgroundColor: '#4caf50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 24,
  },
  simulateScanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  // Bank Transfer Screen Styles
  transferFormContainer: {
    padding: 16,
  },
  transferSectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 16,
  },
  accountCard: {
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedAccountCard: {
    borderColor: '#8ab4f8',
    borderWidth: 1,
  },
  accountDetails: {
    flex: 1,
  },
  bankName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  accountNumber: {
    color: '#ccc',
    fontSize: 14,
    marginTop: 4,
  },
  accountBalance: {
    color: '#8ab4f8',
    fontSize: 14,
    marginTop: 4,
  },
  inputLabel: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 8,
    marginTop: 16,
  },
  transferInput: {
    backgroundColor: '#222',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  bankSelector: {
    backgroundColor: '#222',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#888',
    fontSize: 16,
  },
  selectedBankText: {
    color: '#fff',
    fontSize: 16,
  },
  continueButton: {
    backgroundColor: '#8ab4f8',
    padding: 16,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 16,
  },
  continueButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
  },
  confirmationModal: {
    backgroundColor: '#222',
    borderRadius: 16,
    padding: 24,
    width: '80%',
  },
  confirmationTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 16,
    textAlign: 'center',
  },
  confirmationDetails: {
    marginBottom: 24,
  },
  confirmationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  confirmationLabel: {
    color: '#ccc',
    fontSize: 16,
  },
  confirmationValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  confirmationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: '#333',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 24,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#8ab4f8',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 24,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
  },
  processingModal: {
    backgroundColor: '#222',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    alignItems: 'center',
  },
  processingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 16,
  },
  // Pay Bills Screen Styles
  billSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    margin: 16,
    paddingHorizontal: 16,
    borderRadius: 24,
  },
  billSearchInput: {
    color: '#fff',
    flex: 1,
    paddingVertical: 12,
    marginLeft: 8,
  },
  billCategoriesContainer: {
    padding: 16,
  },
  billSectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 16,
  },
  billCategoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  billCategoryCard: {
    backgroundColor: '#222',
    width: '22%',
    aspectRatio: 0.9,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    marginBottom: 16,
    padding: 8,
  },
  billCategoryIconContainer: {
    marginBottom: 8,
  },
  billCategoryName: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
  recentBillsContainer: {
    marginTop: 16,
  },
  recentBillCard: {
    backgroundColor: '#222',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
  },
  billProviderLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  billProviderLogoText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  recentBillDetails: {
    flex: 1,
  },
  recentBillName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  recentBillAccount: {
    color: '#ccc',
    fontSize: 14,
    marginTop: 4,
  },
  recentBillAmount: {
    alignItems: 'flex-end',
  },
  recentBillText: {
    color: '#888',
    fontSize: 12,
  },
  recentBillValue: {
    color: '#8ab4f8',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 4,
  },
  categoryHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  categoryHeaderTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  backToCategories: {
    padding: 8,
  },
  backToCategoriesText: {
    color: '#8ab4f8',
    fontSize: 14,
  },
  providerCard: {
    backgroundColor: '#222',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  providerLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#555',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  providerLogoText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '500',
  },
  providerName: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
  },
  providersListContainer: {
    padding: 16,
  },
  // Mobile Recharge Screen Styles
  rechargeContainer: {
    padding: 16,
  },
  numberInputContainer: {
    marginBottom: 24,
  },
  numberInputWrapper: {
    backgroundColor: '#222',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
  },
  numberInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    padding: 12,
  },
  detectOperatorButton: {
    backgroundColor: '#8ab4f8',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  detectOperatorText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '500',
  },
  rechargeLabel: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 16,
  },
  operatorSelectionContainer: {
    marginBottom: 24,
  },
  operatorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  operatorCard: {
    width: '22%',
    alignItems: 'center',
    marginBottom: 16,
  },
  operatorLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  operatorLogoText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  operatorName: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  selectedOperatorBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
  },
  selectedOperatorLogo: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  selectedOperatorName: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
  },
  changeButton: {
    backgroundColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  changeButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  planTabsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  planTab: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    marginRight: 16,
  },
  activeTab: {
    borderBottomColor: '#8ab4f8',
  },
  planTabText: {
    color: '#888',
    fontSize: 16,
  },
  activeTabText: {
    color: '#fff',
  },
  plansContainer: {
    marginBottom: 24,
  },
  planCard: {
    backgroundColor: '#222',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  selectedPlanCard: {
    borderColor: '#8ab4f8',
    borderWidth: 1,
  },
  planDetails: {
    flex: 1,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  planAmount: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 12,
  },
  planValidity: {
    color: '#ccc',
    fontSize: 14,
  },
  planData: {
    color: '#8ab4f8',
    fontSize: 16,
    marginBottom: 4,
  },
  planDescription: {
    color: '#888',
    fontSize: 14,
  },
  rechargeButton: {
    backgroundColor: '#8ab4f8',
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 8,
  },
  rechargeButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
  },
  // Fix for camera container
  camera: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000',
    textAlign: 'center',
    marginBottom: 10,
  },
  permissionSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  permissionButton: {
    backgroundColor: 'black',
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default AppNavigator;
