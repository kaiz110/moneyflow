import React, { useRef, useState } from 'react'
import { StyleSheet, View, Text, Button,
     Animated, FlatList, PanResponder, Dimensions } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import firebase from 'firebase'
import { useDispatch } from 'react-redux'
import { fundChange } from '../redux/actions'
import InputModal from '../components/InputModal'

const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIGHT = Dimensions.get('window').width

const zone = SCREEN_HEIGHT * 0.21

const HomeScreen = () => {
    const dispatch = useDispatch()
    
    const LinearGradientAnimated = Animated.createAnimatedComponent(LinearGradient)
    const position = useRef(new Animated.ValueXY()).current
    const scale = useRef(new Animated.Value(1)).current
    const cardOpacity = useRef(new Animated.Value(1)).current
    
    const [modalVisible, setModalVisible] = useState(false)
    const [amountMoney, setAmountMoney] = useState('')
    const [isIn, setIsIn] = useState(false)

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
                (g.dy > zone) ? setIsIn(true) : setIsIn(false)
                setModalVisible(true)
                Animated.sequence([
                    // end
                    Animated.timing(cardOpacity, {
                        toValue: 0,
                        duration: 500,
                        useNativeDriver: false
                    }),
                    // ->
                    Animated.timing(scale, {
                        toValue: 0,
                        duration: 1,
                        useNativeDriver: false
                    }),
                    Animated.timing(position,{
                        toValue: {x: 0, y: 0},
                        duration: 1,
                        useNativeDriver: false
                    }),
                    // start
                    Animated.parallel([
                        Animated.spring(cardOpacity, {
                            toValue: 1,
                            useNativeDriver: false
                        }),
                        Animated.spring(scale, {
                            toValue: 1,
                            useNativeDriver: false
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

    const zoneColor = (height) => {
        const opacity = position.y.interpolate({
            inputRange: height > 0 ? [0,height] : [height,0],
            outputRange: height > 0 ? [0,1] : [1,0]
        })

        return [styles.background, {
            opacity
        }]
    }

    return <View style={styles.container}>  
        <LinearGradientAnimated
            colors={['red','transparent']}
            style={zoneColor(-SCREEN_HEIGHT/2)}
        />
        <LinearGradientAnimated
            colors={['transparent','green']}
            style={zoneColor(SCREEN_HEIGHT/2)}
        />
        <Text style={[styles.text, {top: 10}]}>OUT</Text>
        <Animated.View 
            style={[position.getLayout(),styles.card,
                { transform : [{scale}] , opacity: cardOpacity }]}
            {...pan.panHandlers}
        />
        <Text style={[styles.text, {bottom: 10}]}>IN</Text>

        <InputModal
            showModal={modalVisible}
            title={isIn ? 'In' : 'Out'}
            input={amountMoney}
            inputChange={setAmountMoney}
            confirm={()=>{
                if(isNaN(+amountMoney)){
                    if(isIn) dispatch(fundChange(+amountMoney))
                    else dispatch(fundChange(-+amountMoney))
                } else {

                }

                setModalVisible(false)
                setAmountMoney('')
            }}
            onClose={() => setModalVisible(false)}
        />
    </View>
}

const styles = StyleSheet.create({
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: SCREEN_HEIGHT,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        width: 100,
        height: 100, 
        marginLeft: 10,
        zIndex: 0,
        backgroundColor: 'yellow'
    },
    text: {
        position: 'absolute',
        zIndex: -1,
        margin: 10,
        fontSize: 27
    }
})

export default HomeScreen