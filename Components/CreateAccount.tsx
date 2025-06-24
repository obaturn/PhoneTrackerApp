import { View, Text, StyleSheet, TextInput, Button ,TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth , db } from '../firebaseConfig';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../types/navigation';



export default function CreateAccount() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleCreateAccount = async () => {
    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

     const nameRegex = /^[A-Za-z]+(?:\s[A-Za-z]+)*$/;

    if (!trimmedName || !trimmedEmail || !trimmedPassword) {
      setError('Please fill in all fields');
      return;
    }
    if (!nameRegex.test(trimmedName)) {
      setError('Please enter a valid name (letters and spaces only)');
      return;
    }
    if (trimmedPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    setError(''); // Clear previous errors
    try {
      const userCredentials = await createUserWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
      const user = userCredentials.user;

      await setDoc(doc(db, 'users', user.uid), {
        fullName: trimmedName,
        email: trimmedEmail,
      });
       navigation.navigate('Login');
      Alert.alert('Registration Successful', `${trimmedName}, you have successfully registered your account.`);

      console.log('User Registered Successfully');
    } catch (e: any) {
      console.error(e);
      setError(e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' , color: '#1E40AF' }}>
        Create Account
      </Text>
      <TextInput
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title="Register" onPress={handleCreateAccount} />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={{ marginTop: 20, textAlign: 'center', color: '#007BFF' }}>
          Already have an account? Login Here
          
        </Text>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#DBEAFE',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#000',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
});
