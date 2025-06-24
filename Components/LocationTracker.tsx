import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { getAuth } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function LocationTracker() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [address, setAddress] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [platformMessage, setPlatformMessage] = useState<string>('');

  const getLocationAndSendToFirestore = async () => {
    try {
      setLoading(true);
      setPlatformMessage('');

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location access is required.');
        setLoading(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);

      const addressList = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      const humanAddress = addressList.length > 0
        ? `${addressList[0].name || ''}, ${addressList[0].street || ''}, ${addressList[0].city || ''}, ${addressList[0].region || ''}, ${addressList[0].country || ''}`
        : Platform.OS === 'web'
          ? 'Address not available on web. Please test on a real phone.'
          : 'Unknown';

      setAddress(humanAddress);

      const user = getAuth().currentUser;
      if (user) {
        const locationRef = doc(db, 'locations', user.uid);
        await setDoc(locationRef, {
          email: user.email,
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          address: humanAddress,
          timestamp: serverTimestamp(),
        });

        console.log('Location sent to Firestore!');
      } else {
        Alert.alert('User not authenticated');
      }

      if (Platform.OS === 'web') {
        setPlatformMessage('📢 Web detected — Location and Address may not be 100% accurate.\nFor best results, test on a physical phone.');
      }

      setLoading(false);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch and send location');
      setLoading(false);
    }
  };

  useEffect(() => {
    getLocationAndSendToFirestore();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>📍 Phone Location</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color="#1E40AF" />
      ) : (
        <>
          {location && (
            <Text style={styles.coordText}>
              Latitude: {location.coords.latitude.toFixed(6)}{'\n'}
              Longitude: {location.coords.longitude.toFixed(6)}
            </Text>
          )}
          <Text style={styles.addressText}>📫 Address: {address}</Text>
        </>
      )}

      {platformMessage ? <Text style={styles.platformMessage}>{platformMessage}</Text> : null}

      <Button title="Refresh Location" onPress={getLocationAndSendToFirestore} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 20,
  },
  coordText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
    color: '#111827',
  },
  addressText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    color: '#059669',
  },
  loadingText: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 20,
  },
  platformMessage: {
    fontSize: 14,
    color: '#DC2626',
    marginBottom: 15,
    textAlign: 'center',
  },
});
