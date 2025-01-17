import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { AuthContext } from '../_layout';

export default function ProfileScreen() {
    const router = useRouter();
    const { setIsLoggedIn, isLoggedIn } = useContext(AuthContext);

    const handleLogout = async () => {
        try {
            // Clear the user token from AsyncStorage
            // () => router.replace('/login')
            setIsLoggedIn(false);
            console.log("check var", isLoggedIn)
            await AsyncStorage.removeItem('userToken', () => router.replace('/login'));
        } catch (error) {
            console.error('Failed to log out:', error);
            alert('Failed to log out. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Profile</Text>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#fff',
    },
    logoutButton: {
        backgroundColor: '#E63946',
        padding: 15,
        borderRadius: 8,
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoutText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});