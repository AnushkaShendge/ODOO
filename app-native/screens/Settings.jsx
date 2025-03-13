import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { 
  Feather, 
  MaterialIcons, 
  FontAwesome5, 
  Ionicons,
  AntDesign,
  MaterialCommunityIcons,
  Entypo
} from '@expo/vector-icons';

const SafetyApp = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#4A0D42" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <FontAwesome5 name="dove" size={24} color="white" />
          <Text style={styles.headerTitle}>I'M SAFE</Text>
        </View>
        <TouchableOpacity style={styles.closeButton}>
          <AntDesign name="close" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.contentContainer}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileInfo}>
            <View style={styles.profilePic}>
              <AntDesign name="user" size={40} color="#F5A9C5" />
            </View>
            <View style={styles.profileText}>
              <Text style={styles.profileName}>Vinayak Bhatia</Text>
              <Text style={styles.profilePhone}>+91 9930679651</Text>
            </View>
          </View>
          <TouchableOpacity>
            <Feather name="edit-2" size={20} color="#4A0D42" />
          </TouchableOpacity>
        </View>

        {/* SOS Device Card */}
        <View style={styles.sosCard}>
          <View style={styles.sosHeader}>
            <View style={styles.sosTitle}>
              <MaterialIcons name="device-unknown" size={24} color="#4A0D42" />
              <Text style={styles.sosText}>SOS Device</Text>
            </View>
            <TouchableOpacity>
              <Ionicons name="information-circle-outline" size={24} color="black" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.sosStatus}>
            <View style={styles.noDeviceContainer}>
              <Feather name="smartphone" size={24} color="#CCCCCC" />
              <Text style={styles.noDeviceText}>No device</Text>
            </View>
            
            <View style={styles.connectContainer}>
              <View style={styles.bellIconContainer}>
                <Ionicons name="notifications-outline" size={20} color="#4A0D42" />
              </View>
              <TouchableOpacity style={styles.connectButton}>
                <Text style={styles.connectButtonText}>Connect</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Menu Grid */}
        <View style={styles.menuGrid}>
          {/* Row 1 */}
          <View style={styles.menuRow}>
            <MenuTile icon={<MaterialIcons name="history" size={24} color="#4A0D42" />} title="History" />
            <MenuTile icon={<MaterialCommunityIcons name="hand-clap" size={24} color="#4A0D42" />} title="Friends" />
            <MenuTile icon={<MaterialIcons name="block" size={24} color="#4A0D42" />} title="Block List" />
          </View>
          
          {/* Row 2 */}
          <View style={styles.menuRow}>
            <MenuTile icon={<MaterialIcons name="feedback" size={24} color="#4A0D42" />} title="Feedback" />
            <MenuTile icon={<MaterialIcons name="assignment" size={24} color="#4A0D42" />} title="Legal" />
            <MenuTile icon={<MaterialIcons name="help-outline" size={24} color="#4A0D42" />} title="Help" />
          </View>
          
          {/* Row 3 */}
          <View style={styles.menuRow}>
            <MenuTile icon={<MaterialIcons name="translate" size={24} color="#4A0D42" />} title="Language" />
            <MenuTile icon={<Ionicons name="settings-outline" size={24} color="#4A0D42" />} title="Settings" />
            <MenuTile icon={<Ionicons name="call-outline" size={24} color="#4A0D42" />} title="Helpline" />
          </View>
          
          {/* Row 4 */}
          <View style={styles.menuRow}>
            <MenuTile icon={<Entypo name="share" size={24} color="#4A0D42" />} title="Share App" />
            <MenuTile icon={<MaterialIcons name="logout" size={24} color="#4A0D42" />} title="Log Out" />
            <View style={styles.menuTile}></View> {/* Empty tile for grid balance */}
          </View>
        </View>
      </ScrollView>
      
      {/* Home Indicator */}
      <View style={styles.homeIndicator}>
        <View style={styles.homeIndicatorBar} />
      </View>
    </SafeAreaView>
  );
};

// Menu Tile Component
const MenuTile = ({ icon, title }) => (
  <TouchableOpacity style={styles.menuTile}>
    <View style={styles.menuIconContainer}>
      {icon}
    </View>
    <Text style={styles.menuTitle}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4A0D42',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  profileCard: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePic: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FDE2E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileText: {
    marginLeft: 15,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  profilePhone: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },
  sosCard: {
    backgroundColor: 'white',
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
  },
  sosHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sosTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sosText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
    color: '#333',
  },
  sosStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noDeviceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  noDeviceText: {
    marginLeft: 10,
    color: '#777',
  },
  connectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bellIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  connectButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#4A0D42',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  connectButtonText: {
    color: '#4A0D42',
    fontWeight: '500',
  },
  menuGrid: {
    padding: 8,
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  menuTile: {
    backgroundColor: 'white',
    width: '31%',
    aspectRatio: 1,
    margin: 4,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  menuIconContainer: {
    marginBottom: 10,
  },
  menuTitle: {
    color: '#4A0D42',
    fontSize: 14,
    textAlign: 'center',
  },
  homeIndicator: {
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  homeIndicatorBar: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 3,
  }
});

export default SafetyApp;