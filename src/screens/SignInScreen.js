import React,{ useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Text, Input, Button } from 'react-native-elements'
import firebase from 'firebase'

const SignInScreen = ({navigation}) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const onButtonPress = async () => {
        firebase.auth().signInWithEmailAndPassword('test@gmail.com','123456')
            .then().catch(err => console.log('error : ', err))
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
            leftIcon={{ type: 'material-icons', name: 'lock' }}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
        />
        <Button
            title='LOGIN'
            raised
            onPress={onButtonPress}
        />
        <Button
            title='Register'
            type='clear'
            onPress={()=>navigation.navigate('SignUpScreen')}
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

export default SignInScreen