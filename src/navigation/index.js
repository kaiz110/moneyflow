import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import HomeScreen from '../screens/HomeScreen'
import InfoScreen from '../screens/InfoScreen'
import SignInScreen from '../screens/SignInScreen'
import SignUpScreen from '../screens/SignUpScreen'

const Stack = createStackNavigator()

export default () => {
    return <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen name='SignInScreen' component={SignInScreen}/>
            <Stack.Screen name='SignUpScreen' component={SignUpScreen}/>
            <Stack.Screen name='HomeScreen' component={HomeScreen}/>
            <Stack.Screen name='InfoScreen' component={InfoScreen}/>
        </Stack.Navigator>
    </NavigationContainer>
}