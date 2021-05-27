import React from 'react'
import { StyleSheet, View, Text, Button } from 'react-native'
import firebase from 'firebase'

const HomeScreen = () => {
    const onLogout = () => {
        firebase.auth().signOut().then(()=>console.log('sign out successed.'))
    } 

    return <View>
        <Button
            title='log out'
            onPress={onLogout}
        />    
    </View>
}

const styles = StyleSheet.create({})

export default HomeScreen