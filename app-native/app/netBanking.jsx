import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView, 
  Alert, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const BankingSimulator = () => {
  const router = useRouter();
  const [currentScreen, setCurrentScreen] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [transferAmount, setTransferAmount] = useState('');
  const [transferRemarks, setTransferRemarks] = useState('');
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  
  // Mock data with state
  const [accounts, setAccounts] = useState([
    { id: '1', type: 'Savings', number: '****4567', balance: 12495.60 },
    { id: '2', type: 'Current', number: '****1234', balance: 5678.25 }
  ]);
  
  const [transactions, setTransactions] = useState([
    { id: '1', description: 'Salary Deposit', amount: 25000, date: '15 Mar 2025', type: 'credit' },
    { id: '2', description: 'Electricity Bill', amount: 1450, date: '12 Mar 2025', type: 'debit' },
    { id: '3', description: 'Grocery Shopping', amount: 2300, date: '10 Mar 2025', type: 'debit' },
    { id: '4', description: 'ATM Withdrawal', amount: 5000, date: '05 Mar 2025', type: 'debit' },
    { id: '5', description: 'Interest Credit', amount: 125, date: '01 Mar 2025', type: 'credit' }
  ]);

  const [beneficiaries, setBeneficiaries] = useState([
    { id: '1', name: 'Mom', accountNumber: '9876543210', bank: 'SBI' },
    { id: '2', name: 'Rent', accountNumber: '1234567890', bank: 'HDFC' },
    { id: '3', name: 'Electricity', accountNumber: '2468135790', bank: 'ICICI' }
  ]);

  const [bills, setBills] = useState([
    { id: '1', type: 'Electricity', billNo: 'MHEB2354432', amount: 1450, dueDate: '25 Mar', status: 'pending' },
    { id: '2', type: 'Internet', billNo: 'BBFIB78653', amount: 999, dueDate: '28 Mar', status: 'pending' }
  ]);

  const handleLogin = () => {
    if (username === 'demo' && password === 'password123') {
      setCurrentScreen('dashboard');
    } else {
      Alert.alert('Error', 'Invalid credentials. Use "demo" as username and "password123" as password');
    }
  };

  const handleLogout = () => {
    setUsername('');
    setPassword('');
    setSelectedAccount(null);
    setCurrentScreen('login');
  };

  const handleTransfer = () => {
    if (!selectedAccount || !selectedBeneficiary || !transferAmount) {
      Alert.alert('Error', 'Please select account, beneficiary, and enter amount');
      return;
    }

    const amount = parseFloat(transferAmount);
    if (amount > selectedAccount.balance) {
      Alert.alert('Error', 'Insufficient balance');
      return;
    }

    Alert.alert(
      'Confirm Transfer',
      `Transfer ₹${amount} to ${selectedBeneficiary.name}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Confirm',
          onPress: () => {
            // Update account balance
            setAccounts(accounts.map(acc => 
              acc.id === selectedAccount.id 
                ? { ...acc, balance: acc.balance - amount }
                : acc
            ));

            // Add transaction
            const newTransaction = {
              id: Date.now().toString(),
              description: `Transfer to ${selectedBeneficiary.name}`,
              amount: amount,
              date: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
              type: 'debit'
            };
            setTransactions([newTransaction, ...transactions]);

            setTransferAmount('');
            setTransferRemarks('');
            setCurrentScreen('dashboard');
            Alert.alert('Success', 'Transfer completed successfully');
          }
        }
      ]
    );
  };

  const handleBillPayment = (bill) => {
    if (!selectedAccount) {
      Alert.alert('Error', 'Please select an account first');
      return;
    }

    if (bill.amount > selectedAccount.balance) {
      Alert.alert('Error', 'Insufficient balance');
      return;
    }

    Alert.alert(
      'Confirm Payment',
      `Pay ₹${bill.amount} for ${bill.type} bill?`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Pay',
          onPress: () => {
            // Update account balance
            setAccounts(accounts.map(acc => 
              acc.id === selectedAccount.id 
                ? { ...acc, balance: acc.balance - bill.amount }
                : acc
            ));

            // Update bill status
            setBills(bills.map(b => 
              b.id === bill.id ? { ...b, status: 'paid' } : b
            ));

            // Add transaction
            const newTransaction = {
              id: Date.now().toString(),
              description: `${bill.type} Bill Payment`,
              amount: bill.amount,
              date: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
              type: 'debit'
            };
            setTransactions([newTransaction, ...transactions]);

            Alert.alert('Success', 'Bill paid successfully');
          }
        }
      ]
    );
  };

  const handleAddBeneficiary = () => {
    Alert.alert(
      'Add Beneficiary',
      'This would open a form to add a new beneficiary in a real app',
      [{ text: 'OK' }]
    );
  };

  const renderLoginScreen = () => (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.loginContainer}>
      <View style={styles.logoContainer}>
        <View style={styles.logo}>
          <Feather name="shield" size={40} color="#4f46e5" />
        </View>
        <Text style={styles.bankName}>Secure Bank</Text>
        <Text style={styles.tagline}>Your trusted banking partner</Text>
      </View>
      
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
        <Text style={styles.hintText}>Hint: Use "demo" / "password123"</Text>
      </View>
    </KeyboardAvoidingView>
  );

  const renderDashboard = () => (
    <ScrollView style={styles.dashboardContainer}>
      <View style={styles.accountsSection}>
        <Text style={styles.sectionTitle}>Accounts</Text>
        {accounts.map(account => (
          <TouchableOpacity 
            key={account.id}
            style={[styles.accountCard, selectedAccount?.id === account.id && styles.selectedCard]}
            onPress={() => setSelectedAccount(account)}
          >
            <Text style={styles.accountType}>{account.type} Account</Text>
            <Text style={styles.accountNumber}>{account.number}</Text>
            <Text style={styles.accountBalance}>₹ {account.balance.toLocaleString('en-IN')}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.actionsSection}>
        <TouchableOpacity style={styles.actionButton} onPress={() => setCurrentScreen('transfer')}>
          <Feather name="send" size={24} color="#4f46e5" />
          <Text style={styles.actionText}>Transfer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => setCurrentScreen('billpay')}>
          <Feather name="file-text" size={24} color="#4f46e5" />
          <Text style={styles.actionText}>Pay Bills</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.transactionsSection}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        {transactions.slice(0, 5).map(tx => (
          <View key={tx.id} style={styles.transactionItem}>
            <Text style={styles.transactionDesc}>{tx.description}</Text>
            <Text style={[styles.transactionAmount, tx.type === 'credit' ? styles.credit : styles.debit]}>
              {tx.type === 'credit' ? '+' : '-'} ₹{tx.amount}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderTransferScreen = () => (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.transferContainer}>
      <Text style={styles.screenTitle}>Transfer Money</Text>
      
      <Text style={styles.formLabel}>From Account</Text>
      {accounts.map(account => (
        <TouchableOpacity 
          key={account.id}
          style={[styles.optionCard, selectedAccount?.id === account.id && styles.selectedCard]}
          onPress={() => setSelectedAccount(account)}
        >
          <Text>{account.type} ({account.number}) - ₹{account.balance.toLocaleString('en-IN')}</Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.formLabel}>To Beneficiary</Text>
      {beneficiaries.map(beneficiary => (
        <TouchableOpacity 
          key={beneficiary.id}
          style={[styles.optionCard, selectedBeneficiary?.id === beneficiary.id && styles.selectedCard]}
          onPress={() => setSelectedBeneficiary(beneficiary)}
        >
          <Text>{beneficiary.name} - {beneficiary.bank} ({beneficiary.accountNumber})</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={styles.addButton} onPress={handleAddBeneficiary}>
        <Text style={styles.addButtonText}>+ Add Beneficiary</Text>
      </TouchableOpacity>

      <Text style={styles.formLabel}>Amount</Text>
      <TextInput
        style={styles.input}
        placeholder="₹0.00"
        value={transferAmount}
        onChangeText={setTransferAmount}
        keyboardType="numeric"
      />
      
      <Text style={styles.formLabel}>Remarks</Text>
      <TextInput
        style={styles.input}
        placeholder="Optional note"
        value={transferRemarks}
        onChangeText={setTransferRemarks}
      />

      <TouchableOpacity style={styles.transferButton} onPress={handleTransfer}>
        <Text style={styles.buttonText}>Transfer Now</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );

  const renderBillPayScreen = () => (
    <ScrollView style={styles.billPayContainer}>
      <Text style={styles.screenTitle}>Pay Bills</Text>
      
      <Text style={styles.formLabel}>Pay From</Text>
      {accounts.map(account => (
        <TouchableOpacity 
          key={account.id}
          style={[styles.optionCard, selectedAccount?.id === account.id && styles.selectedCard]}
          onPress={() => setSelectedAccount(account)}
        >
          <Text>{account.type} ({account.number}) - ₹{account.balance.toLocaleString('en-IN')}</Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.sectionTitle}>Pending Bills</Text>
      {bills.map(bill => (
        <View key={bill.id} style={styles.billItem}>
          <View>
            <Text style={styles.billTitle}>{bill.type} Bill</Text>
            <Text style={styles.billDetail}>Bill No: {bill.billNo}</Text>
            <Text style={styles.billDetail}>Due: {bill.dueDate}</Text>
          </View>
          <View style={styles.billRight}>
            <Text style={styles.billAmount}>₹{bill.amount}</Text>
            {bill.status === 'pending' && (
              <TouchableOpacity 
                style={styles.payButton}
                onPress={() => handleBillPayment(bill)}
              >
                <Text style={styles.payButtonText}>Pay Now</Text>
              </TouchableOpacity>
            )}
            {bill.status === 'paid' && (
              <Text style={styles.paidText}>Paid</Text>
            )}
          </View>
        </View>
      ))}
    </ScrollView>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => currentScreen === 'login' ? router.back() : setCurrentScreen('dashboard')}>
        <Feather name="arrow-left" size={24} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{currentScreen === 'login' ? 'Login' : 
        currentScreen === 'dashboard' ? 'Dashboard' : 
        currentScreen === 'transfer' ? 'Transfer' : 'Bills'}</Text>
      {currentScreen !== 'login' && (
        <TouchableOpacity onPress={handleLogout}>
          <Feather name="log-out" size={24} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      {currentScreen === 'login' && renderLoginScreen()}
      {currentScreen === 'dashboard' && renderDashboard()}
      {currentScreen === 'transfer' && renderTransferScreen()}
      {currentScreen === 'billpay' && renderBillPayScreen()}
    </SafeAreaView>
  );
};

BankingSimulator.displayName = 'BankingSimulator';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 15, 
    backgroundColor: '#4f46e5' 
  },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  
  // Login
  loginContainer: { flex: 1, justifyContent: 'center', padding: 20 },
  logoContainer: { alignItems: 'center', marginBottom: 40 },
  logo: { 
    width: 80, 
    height: 80, 
    borderRadius: 40, 
    backgroundColor: '#e5e7eb', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  bankName: { fontSize: 24, fontWeight: 'bold', color: '#1f2937' },
  tagline: { fontSize: 16, color: '#6b7280' },
  input: { 
    borderWidth: 1, 
    borderColor: '#d1d5db', 
    borderRadius: 8, 
    padding: 12, 
    marginBottom: 15, 
    backgroundColor: '#fff' 
  },
  loginButton: { 
    backgroundColor: '#4f46e5', 
    padding: 15, 
    borderRadius: 8, 
    alignItems: 'center' 
  },
  loginButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  hintText: { textAlign: 'center', color: '#6b7280', marginTop: 10 },

  // Dashboard
  dashboardContainer: { padding: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#1f2937' },
  accountCard: { 
    backgroundColor: '#fff', 
    padding: 15, 
    borderRadius: 8, 
    marginBottom: 10,
    elevation: 2 
  },
  selectedCard: { borderWidth: 2, borderColor: '#4f46e5' },
  accountType: { fontSize: 16, fontWeight: 'bold' },
  accountNumber: { color: '#6b7280', marginVertical: 5 },
  accountBalance: { fontSize: 18, fontWeight: 'bold', color: '#15803d' },
  actionsSection: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 20 },
  actionButton: { alignItems: 'center' },
  actionText: { marginTop: 5, color: '#1f2937' },
  transactionItem: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingVertical: 10, 
    borderBottomWidth: 1, 
    borderBottomColor: '#e5e7eb' 
  },
  transactionDesc: { flex: 1 },
  transactionAmount: { fontWeight: 'bold' },
  credit: { color: '#15803d' },
  debit: { color: '#dc2626' },

  // Transfer
  transferContainer: { padding: 15 },
  screenTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: '#1f2937' },
  formLabel: { fontSize: 14, fontWeight: 'bold', marginBottom: 10, color: '#1f2937' },
  optionCard: { 
    backgroundColor: '#fff', 
    padding: 15, 
    borderRadius: 8, 
    marginBottom: 10, 
    elevation: 2 
  },
  addButton: { alignItems: 'center', marginVertical: 10 },
  addButtonText: { color: '#4f46e5', fontWeight: 'bold' },
  transferButton: { 
    backgroundColor: '#4f46e5', 
    padding: 15, 
    borderRadius: 8, 
    alignItems: 'center', 
    marginTop: 20 
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  // Bills
  billPayContainer: { padding: 15 },
  billItem: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    backgroundColor: '#fff', 
    padding: 15, 
    borderRadius: 8, 
    marginBottom: 10, 
    elevation: 2 
  },
  billTitle: { fontWeight: 'bold' },
  billDetail: { color: '#6b7280', fontSize: 12 },
  billRight: { alignItems: 'flex-end' },
  billAmount: { fontWeight: 'bold', color: '#1f2937' },
  payButton: { 
    backgroundColor: '#4f46e5', 
    padding: 8, 
    borderRadius: 5, 
    marginTop: 5 
  },
  payButtonText: { color: '#fff', fontSize: 12 },
  paidText: { color: '#15803d', fontWeight: 'bold', marginTop: 5 }
});

export default BankingSimulator;
