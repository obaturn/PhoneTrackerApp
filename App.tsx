// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from './Components/WelcomeScreen';
import CreateAccount from './Components/CreateAccount'; 
import Login from './Components/Login';
import MenuScreen from './Components/MenuScreen';
import LocationTracker from './Components/LocationTracker';
import TrackLostPhone from './Components/TrackLostPhone';
import { RootStackParamList } from './types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="CreateAccount" component={CreateAccount} />
        <Stack.Screen name='Login' component={Login}/>
        <Stack.Screen name="MenuScreen" component={MenuScreen} />
        <Stack.Screen name="LocationTracker" component={LocationTracker} />
        <Stack.Screen name="TrackLostPhone" component={TrackLostPhone} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
