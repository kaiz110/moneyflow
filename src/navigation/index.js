import React,{ useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import HomeScreen from '../screens/HomeScreen'
import InfoScreen from '../screens/InfoScreen'
import SignInScreen from '../screens/SignInScreen'
import SignUpScreen from '../screens/SignUpScreen'
import firebase from 'firebase'
import 'firebase/auth'
import 'firebase/database'

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

const Login = () => {
    return <Stack.Navigator>
        <Stack.Screen name='SignInScreen' component={SignInScreen} options={{headerShown: false}}/>
        <Stack.Screen name='SignUpScreen' component={SignUpScreen} options={{title: 'Register'}}/>
    </Stack.Navigator>
}

const Home = () => {
    return <Tab.Navigator>
        <Tab.Screen name='HomeScreen' component={HomeScreen}/>
        <Tab.Screen name='InfoScreen' component={InfoScreen}/>
    </Tab.Navigator>
}

export default () => {
    const [isLogin, setIsLogin] = useState(false)

    useEffect(() => {
        const firebaseConfig = {
            apiKey: "AIzaSyAAxh0Yf0I-IYUb7g-wCYN32YOoTAB9aLQ",
            authDomain: "auth-81e99.firebaseapp.com",
            databaseURL: "https://auth-81e99.firebaseio.com",
            projectId: "auth-81e99",
            storageBucket: "auth-81e99.appspot.com",
            messagingSenderId: "994298999545",
            appId: "1:994298999545:web:c1e7bd5f56e96ad404a828",
            measurementId: "G-8ERPN4CSN1"
        }
      
        firebase.initializeApp(firebaseConfig)

        firebase.auth().onAuthStateChanged(user => {
            if(user) setIsLogin(true)
            else setIsLogin(false)
        })
    },[])

    return <NavigationContainer>
        <Stack.Navigator>
            {isLogin
            ? <Stack.Screen name='Home' component={Home} options={{headerShown: false}}/>
            : <Stack.Screen name='Login' component={Login} options={{headerShown: false}}/>
            }
        </Stack.Navigator>
    </NavigationContainer>
}