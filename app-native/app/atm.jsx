

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, SafeAreaView, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const ATMSimulator = () => {
  // State for tracking the current screen in the ATM flow
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [pin, setPin] = useState('');
  const [amount, setAmount] = useState('');
  const [cardInserted, setCardInserted] = useState(false);
  const [balance, setBalance] = useState(1250.75);
  const [receiptRequested, setReceiptRequested] = useState(false);
  
  // Function to handle PIN input
  const handlePinInput = (digit) => {
    if (pin.length < 4) {
      setPin(pin + digit);
    }
  };
  
  // Function to clear PIN
  const clearPin = () => {
    setPin('');
  };
  
  // Function to handle amount input
  const handleAmountInput = (digit) => {
    setAmount(amount + digit);
  };
  
  // Function to clear amount
  const clearAmount = () => {
    setAmount('');
  };
  
  // Function to insert card
  const insertCard = () => {
    setCardInserted(true);
    setCurrentScreen('pin');
  };
  
  // Function to handle PIN submission
  const submitPin = () => {
    if (pin.length === 4) {
      setCurrentScreen('menu');
    }
  };
  
  // Function to navigate to withdrawal screen
  const goToWithdrawal = () => {
    setCurrentScreen('withdrawal');
  };
  
  // Function to navigate to balance screen
  const goToBalance = () => {
    setCurrentScreen('balance');
  };
  
  // Function to handle withdrawal
  const withdraw = () => {
    if (amount && Number(amount) <= balance) {
      setBalance(balance - Number(amount));
      setCurrentScreen('receipt');
    }
  };
  
  // Function to finish transaction
  const finishTransaction = () => {
    setCardInserted(false);
    setPin('');
    setAmount('');
    setReceiptRequested(false);
    setCurrentScreen('welcome');
  };
  
  // Function to request receipt
  const requestReceipt = () => {
    setReceiptRequested(true);
    setCurrentScreen('thankyou');
  };
  
  // Function to skip receipt
  const skipReceipt = () => {
    setReceiptRequested(false);
    setCurrentScreen('thankyou');
  };
  
  // Render ATM keypad
  const renderKeypad = (onPress, clearFn) => {
    const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
    return (
      <View style={styles.keypadContainer}>
        <View style={styles.keypad}>
          {digits.map((digit) => (
            <TouchableOpacity 
              key={digit} 
              style={styles.keypadButton}
              onPress={() => onPress(digit)}
            >
              <Text style={styles.keypadButtonText}>{digit}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.functionButtons}>
          <TouchableOpacity 
            style={[styles.functionButton, styles.redButton]}
            onPress={clearFn}
          >
            <Text style={styles.functionButtonText}>CLEAR</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.functionButton, styles.greenButton]}
            onPress={currentScreen === 'pin' ? submitPin : withdraw}
          >
            <Text style={styles.functionButtonText}>ENTER</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
  // Render current screen based on state
  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return (
          <View style={styles.screenContent}>
            <Text style={styles.welcomeText}>Welcome to ATM Simulator</Text>
            <Text style={styles.instructionText}>Please insert your card to begin</Text>
            {!cardInserted && (
              <TouchableOpacity style={styles.insertCardButton} onPress={insertCard}>
                <Text style={styles.insertCardText}>INSERT CARD</Text>
              </TouchableOpacity>
            )}
          </View>
        );
        
      case 'pin':
        return (
          <View style={styles.screenContent}>
            <Text style={styles.instructionText}>Please enter your PIN</Text>
            <View style={styles.pinContainer}>
              {Array(4).fill().map((_, index) => (
                <View key={index} style={styles.pinDot}>
                  {pin.length > index && <View style={styles.filledPinDot} />}
                </View>
              ))}
            </View>
            {renderKeypad(handlePinInput, clearPin)}
          </View>
        );
        
      case 'menu':
        return (
          <View style={styles.screenContent}>
            <Text style={styles.instructionText}>Select a transaction</Text>
            <View style={styles.menuButtons}>
              <TouchableOpacity style={styles.menuButton} onPress={goToWithdrawal}>
                <Text style={styles.menuButtonText}>Withdraw Cash</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuButton} onPress={goToBalance}>
                <Text style={styles.menuButtonText}>Check Balance</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuButton} onPress={finishTransaction}>
                <Text style={styles.menuButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
        
      case 'withdrawal':
        return (
          <View style={styles.screenContent}>
            <Text style={styles.instructionText}>Enter withdrawal amount</Text>
            <View style={styles.amountContainer}>
              <Text style={styles.currencySymbol}>$</Text>
              <Text style={styles.amountText}>{amount}</Text>
            </View>
            {renderKeypad(handleAmountInput, clearAmount)}
          </View>
        );
        
      case 'balance':
        return (
          <View style={styles.screenContent}>
            <Text style={styles.instructionText}>Your current balance</Text>
            <Text style={styles.balanceText}>${balance.toFixed(2)}</Text>
            <TouchableOpacity style={styles.backButton} onPress={() => setCurrentScreen('menu')}>
              <Text style={styles.backButtonText}>Back to Menu</Text>
            </TouchableOpacity>
          </View>
        );
        
      case 'receipt':
        return (
          <View style={styles.screenContent}>
            <Text style={styles.instructionText}>Would you like a receipt?</Text>
            <View style={styles.receiptButtons}>
              <TouchableOpacity style={styles.receiptButton} onPress={requestReceipt}>
                <Text style={styles.receiptButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.receiptButton} onPress={skipReceipt}>
                <Text style={styles.receiptButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
        
      case 'thankyou':
        return (
          <View style={styles.screenContent}>
            <Text style={styles.welcomeText}>Thank You!</Text>
            <Text style={styles.instructionText}>
              {receiptRequested ? 'Please take your cash and receipt.' : 'Please take your cash.'}
            </Text>
            <TouchableOpacity style={styles.finishButton} onPress={finishTransaction}>
              <Text style={styles.finishButtonText}>New Transaction</Text>
            </TouchableOpacity>
          </View>
        );
        
      default:
        return <View />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ATM Body */}
      <View style={styles.atmBody}>
        {/* ATM Brand Logo */}
        <View style={styles.atmHeader}>
          <Text style={styles.atmLogo}>BANK ATM</Text>
        </View>
        
        {/* Card Slot */}
        <View style={styles.cardSlotContainer}>
          {cardInserted ? (
            <View style={styles.cardInserted} />
          ) : (
            <View style={styles.cardSlot} />
          )}
          <Text style={styles.slotLabel}>CARD</Text>
        </View>
        
        {/* Screen */}
        <View style={styles.screen}>
          {renderScreen()}
        </View>
        
        {/* Cash Dispenser */}
        <View style={styles.dispenserContainer}>
          <View style={styles.cashDispenser} />
          <Text style={styles.slotLabel}>CASH</Text>
        </View>
        
        {/* Receipt Printer */}
        <View style={styles.receiptContainer}>
          <View style={styles.receiptSlot} />
          <Text style={styles.slotLabel}>RECEIPT</Text>
        </View>
        
        {/* Navigation Bar */}
        <View style={styles.navigationBar}>
          <Text style={styles.navText}>
            {currentScreen === 'welcome' ? 'Start' : 
             currentScreen === 'pin' ? 'Enter PIN' :
             currentScreen === 'menu' ? 'Select Option' :
             currentScreen === 'withdrawal' ? 'Enter Amount' :
             currentScreen === 'balance' ? 'View Balance' :
             currentScreen === 'receipt' ? 'Receipt Option' : 'Finish'}
          </Text>
          <View style={styles.navDots}>
            {['welcome', 'pin', 'menu', 'withdrawal', 'receipt', 'thankyou'].map((screen, index) => (
              <View 
                key={index} 
                style={[
                  styles.navDot, 
                  ['welcome', 'pin', 'menu'].indexOf(currentScreen) >= ['welcome', 'pin', 'menu'].indexOf(screen) ||
                  (currentScreen === 'withdrawal' && screen === 'withdrawal') ||
                  (currentScreen === 'balance' && screen === 'menu') ||
                  (currentScreen === 'receipt' && ['withdrawal', 'receipt'].indexOf(screen) >= 0) ||
                  (currentScreen === 'thankyou' && screen !== 'balance')
                    ? styles.activeDot 
                    : {}
                ]} 
              />
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  atmBody: {
    width: width * 0.9,
    height: height * 0.9,
    backgroundColor: '#525252',
    borderRadius: 20,
    padding: 15,
    borderWidth: 8,
    borderColor: '#444',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 20,
  },
  atmHeader: {
    height: 40,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 15,
  },
  atmLogo: {
    color: '#e7e7e7',
    fontWeight: 'bold',
    fontSize: 20,
  },
  screen: {
    flex: 1,
    backgroundColor: '#e7e7e7',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: '#333',
    marginVertical: 15,
  },
  screenContent: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  instructionText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  insertCardButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  insertCardText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cardSlotContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  cardSlot: {
    width: 60,
    height: 5,
    backgroundColor: '#222',
    borderRadius: 2,
    marginVertical: 5,
  },
  cardInserted: {
    width: 60,
    height: 10,
    backgroundColor: '#777',
    borderRadius: 2,
    marginVertical: 5,
  },
  slotLabel: {
    color: '#ddd',
    fontSize: 12,
    fontWeight: 'bold',
  },
  dispenserContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  cashDispenser: {
    width: 100,
    height: 8,
    backgroundColor: '#222',
    borderRadius: 4,
    marginVertical: 5,
  },
  receiptContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  receiptSlot: {
    width: 80,
    height: 5,
    backgroundColor: '#222',
    borderRadius: 2,
    marginVertical: 5,
  },
  navigationBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 5,
  },
  navText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  navDots: {
    flexDirection: 'row',
  },
  navDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#777',
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: '#3498db',
  },
  pinContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  pinDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filledPinDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#333',
  },
  keypadContainer: {
    width: '100%',
    paddingHorizontal: 10,
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  keypadButton: {
    width: '30%',
    aspectRatio: 1.5,
    backgroundColor: '#ddd',
    margin: '1.5%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#bbb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  keypadButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  functionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  functionButton: {
    width: '45%',
    paddingVertical: 12,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  redButton: {
    backgroundColor: '#e74c3c',
  },
  greenButton: {
    backgroundColor: '#2ecc71',
  },
  functionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  menuButtons: {
    width: '100%',
  },
  menuButton: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
  },
  menuButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  amountContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  currencySymbol: {
    fontSize: 26,
    fontWeight: 'bold',
    marginRight: 5,
  },
  amountText: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  balanceText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2ecc71',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  receiptButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  receiptButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 5,
  },
  receiptButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  finishButton: {
    backgroundColor: '#2ecc71',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  finishButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ATMSimulator;

