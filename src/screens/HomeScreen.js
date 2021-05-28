import React, { useRef } from 'react'
import { StyleSheet, View, Text, Button, Animated, FlatList, PanResponder } from 'react-native'
import firebase from 'firebase'

const HomeScreen = () => {
    const position = useRef(new Animated.ValueXY()).current
    const pan = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {},
        onPanResponderMove: (e,g) => {
            position.setValue({x: g.dx, y: g.dy})
        },
        onPanResponderRelease: (e,g) => {}
    })

    const action = () => {
        Animated.loop(
            Animated.sequence([
                Animated.spring(position, {
                    toValue: {
                        x: 0,
                        y: 100
                    },
                    useNativeDriver: false
                }),
                Animated.spring(position,{
                    toValue: {
                        x: 0,
                        y: 0
                    },
                    useNativeDriver: false
                }),   
            ])  
        ).start()
    }

    const onLogout = () => {
        firebase.auth().signOut().then(()=>console.log('sign out successed.'))
    } 

    return <View style={styles.container}>  
        <Button
            title='action'
            onPress={action}
        />
        <View style={{borderWidth:1}}>
        <FlatList
            data={new Array(20)}
            keyExtractor={(d,index) => `${d} ${index}`}
            horizontal
            renderItem={({item}) => {
                return <Animated.View 
                    style={[position.getLayout(),styles.card]}
                    {...pan.panHandlers}
                />
            }}
        />
        </View>
        
    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    card: {
        width: 100,
        height: 100, 
        marginLeft: 10,
        backgroundColor: 'red'
    }
})

export default HomeScreen