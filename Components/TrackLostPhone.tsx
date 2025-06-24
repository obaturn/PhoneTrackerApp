import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function TrackLostPhone() {
  const [email, setEmail] = useState('');
  const [locationData, setLocationData] = useState<any>(null);

  const handleTrackPhone = async () => {
    if (!email.trim()) {
      Alert.alert('Input Error', 'Please enter an email address.');
      return;
    }

    try {
      const q = query(collection(db, 'locations'), where('email', '==', email.trim()));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        Alert.alert('Not Found', 'No location data found for this email.');
        return;
      }

      const userLocation = querySnapshot.docs[0].data();
      setLocationData(userLocation);
    } catch (error) {
      console.error('Error fetching location data:', error);
      Alert.alert('Error', 'Something went wrong while tracking the phone.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Track a Lost Phone</Text>

      <TextInput
        placeholder="Enter email address"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Button title="Track Phone" onPress={handleTrackPhone} />

      {locationData && (
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>📍 Latitude: {locationData.latitude}</Text>
          <Text style={styles.resultText}>📍 Longitude: {locationData.longitude}</Text>
          <Text style={styles.resultText}>📫 Address: {locationData.address}</Text>
          <Text style={styles.resultText}>🕒 Last Seen: {locationData.timestamp?.toDate().toLocaleString()}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#1E3A8A',
  },
  input: {
    height: 50,
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  resultBox: {
    marginTop: 30,
    backgroundColor: '#E0F2FE',
    padding: 15,
    borderRadius: 10,
  },
  resultText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#111827',
  },
});
