import { View, Text, StyleSheet ,ActivityIndicator} from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
type WelcomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;
export default function WelcomeScreen() {
    const navigation = useNavigation<WelcomeScreenNavigationProp>();
    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.navigate('CreateAccount'); // Navigate to CreateAccount after 5 seconds
        }, 5000); // Navigate after 5 seconds

        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <View style={Styles.head}>
            <Text style={Styles.text}> Welcome To ObaTurn Phone Tracking</Text>
            <ActivityIndicator size="large" color="#2563EB"  style={{ marginTop: 20 }}/>
            <Text style={Styles.text}>Loading...</Text>
            
        </View>
    );
}

const Styles = StyleSheet.create({
    head:{

        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#DBEAFE'
    },
    text:{
        fontSize:20,
        fontWeight:'bold',
        color: '#2563EB', 


    }

})