import React,{ useState } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { Input, Button } from 'react-native-elements'
import firebase from 'firebase'

const SignUpScreen = ({navigation}) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const onButtonPress = () => {
        firebase.auth().createUserWithEmailAndPassword(email,password)
    }

    return <View>
        <Input
            label='Your Email'
            placeholder='email@xxx.com'
            leftIcon={{ type: 'material-icons', name: 'email' }}
            value={email}
            onChangeText={setEmail}
        />
        <Input
            label='Password'
            placeholder='password'
            leftIcon={{ type: 'material-icons', name: 'lock' }}
            value={password}
            onChangeText={setPassword}
        />
        <Button
            title='Register'
            raised
            onPress={onButtonPress}
        />
    </View>
}

const styles = StyleSheet.create({})

export default SignUpScreen