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
        <Stack.Screen name='SignUpScreen' component={SignUpScreen} options={{headerShown: false}}/>
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
            apiKey: "AIzaSyDWdfr3yOQKQr9w2cih-5_OXtXQreDyRnA",
            authDomain: "moneyflow-86c5b.firebaseapp.com",
            projectId: "moneyflow-86c5b",
            storageBucket: "moneyflow-86c5b.appspot.com",
            messagingSenderId: "771830985719",
            appId: "1:771830985719:web:1eefcee19f497d6804f4f2",
            measurementId: "G-W65STF739V"
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