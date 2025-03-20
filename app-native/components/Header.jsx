import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";

const Header = () => {
    const router = useRouter();
    return (
        <View style={styles.header}>
            <View style={styles.headerLeft}>
                <FontAwesome5 name="dove" size={24} color="#F94989" />
                <Text style={styles.headerTitle}>I'M SAFE</Text>
            </View>
            <View style={styles.headerRight}>
                <TouchableOpacity style={styles.bellButton}>
                    <Ionicons name="notifications-outline" size={24} color="#333" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/menu')} style={styles.menuButton}>
                    <Ionicons name="menu" size={28} color="#333" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Header;

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#fff',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        color: '#F94989',
        fontSize: 22,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    bellButton: {
        marginRight: 15,
    },
    menuButton: {
        
    },
});