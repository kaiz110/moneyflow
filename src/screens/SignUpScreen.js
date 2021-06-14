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

    return <View style={styles.container}>
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
            secureTextEntry
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        bottom: 75,
    }
})

export default SignUpScreen