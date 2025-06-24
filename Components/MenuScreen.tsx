// MenuScreen.tsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

export default function MenuScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>📱 Phone Tracker Menu</Text>

      <View style={styles.buttonContainer}>
        <Button
          title="Track My Phone"
          color="#1E40AF"
          onPress={() => navigation.navigate('LocationTracker')}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Track Lost Phone by Email"
          color="#EF4444"
          onPress={() => navigation.navigate('TrackLostPhone')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F9FF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#1E3A8A',
    textAlign: 'center',
  },
  buttonContainer: {
    width: '80%',
    marginBottom: 20,
  },
});
