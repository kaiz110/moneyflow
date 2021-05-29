import React, { useRef } from 'react'
import { StyleSheet, View, Text, Button,
     Animated, FlatList, PanResponder, Dimensions } from 'react-native'
import firebase from 'firebase'

const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIGHT = Dimensions.get('window').width

const zone = SCREEN_HEIGHT * 0.21

const HomeScreen = () => {
    const position = useRef(new Animated.ValueXY()).current
    const scale = useRef(new Animated.Value(1)).current
    const opacity = useRef(new Animated.Value(1)).current
    const pan = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
            Animated.timing(scale,{
                toValue: 1.25,
                duration: 150,
                useNativeDriver: false
            }).start()
        },
        onPanResponderMove: (e,g) => {
            position.setValue({x: g.dx, y: g.dy})
        },
        onPanResponderRelease: (e,g) => {
            if(g.dy > zone || g.dy < -zone){
                Animated.sequence([
                    // end
                    Animated.timing(opacity, {
                        toValue: 0,
                        duration: 500
                    }),
                    // ->
                    Animated.timing(scale, {
                        toValue: 0,
                        duration: 1
                    }),
                    Animated.timing(position,{
                        toValue: {x: 0, y: 0},
                        duration: 1
                    }),
                    // start
                    Animated.parallel([
                        Animated.spring(opacity, {
                            toValue: 1
                        }),
                        Animated.spring(scale, {
                            toValue: 1
                        }) 
                    ])
                    
                ]).start()
            } else {
                Animated.parallel([
                    Animated.spring(position, {
                        toValue: {x: 0, y: 0},
                        useNativeDriver: false
                    }),
                    Animated.timing(scale, {
                        toValue: 1,
                        duration: 450,
                        useNativeDriver: false
                    })  
                ]).start()
            }
            
        }
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

        <Animated.View 
            style={[position.getLayout(),styles.card,
                { transform : [{scale}] , opacity }
            ]}
            {...pan.panHandlers}
        />
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