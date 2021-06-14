import React, { useLayoutEffect, useRef, useState } from 'react'
import { StyleSheet, View, Text, Button, SafeAreaView,
    Animated, FlatList, PanResponder, Dimensions, TouchableOpacity } from 'react-native'
import { Chip } from 'react-native-elements'
import { LinearGradient } from 'expo-linear-gradient'
import { useDispatch, useSelector } from 'react-redux'
import { moneyIn, moneyOut, historySave, rehydrateState } from '../redux/actions'
import moment from 'moment'
import firebase from 'firebase'
import InputModal from '../components/InputModal'

import { upload, getValue } from '../firebase'
import { LogBox } from 'react-native';

LogBox.ignoreLogs(['Setting a timer']);

const SCREEN_HEIGHT = Dimensions.get('window').height

const zone = SCREEN_HEIGHT * 0.20

const HomeScreen = () => {
    const dispatch = useDispatch()
    const tags = useSelector(state => state.tags)
    const history = useSelector(state => state.history)
    
    const LinearGradientAnimated = Animated.createAnimatedComponent(LinearGradient)
    const position = useRef(new Animated.ValueXY()).current
    const scale = useRef(new Animated.Value(1)).current
    const cardOpacity = useRef(new Animated.Value(1)).current
    
    const [modalVisible, setModalVisible] = useState(false)
    const [amountMoney, setAmountMoney] = useState('')
    const [note, setNote] = useState('')
    const [isIn, setIsIn] = useState(false)
    const [currentTag, setCurrentTag] = useState([])

    const firstUpdate = useRef(true)

    useLayoutEffect(() => {
        if(firstUpdate.current) {
            firstUpdate.current = false
            return
        } 
        upload('history', history)
    },[history])
    
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
                //
                setAmountMoney('')
                setNote('')
                setCurrentTag([])
                setModalVisible(true)
                //
                Animated.sequence([
                    // end
                    Animated.parallel([
                        Animated.timing(position, {
                            toValue: {x: 0, y: g.dy>zone ? SCREEN_HEIGHT : -SCREEN_HEIGHT},
                            duration: 500,
                            useNativeDriver: false
                        }),
                        Animated.timing(cardOpacity, {
                            toValue: 0,
                            duration: 500,
                            useNativeDriver: false
                        })
                    ]),
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

        return [styles.background, { opacity }]
    }

    const modalConfirm = () => {
        if(isNaN(+amountMoney) === false && +amountMoney != 0){
            dispatch(historySave({
                type: isIn ? 'IN' : 'OUT',
                amount: +amountMoney,
                tag: currentTag,
                note: note,
                time: moment().format()
            }))
        } else {}

        setModalVisible(false)
    }

    return <SafeAreaView style={styles.container}>  
        <LinearGradientAnimated
            colors={['red','transparent']}
            style={zoneColor(-SCREEN_HEIGHT/4)}
        />
        <LinearGradientAnimated
            colors={['transparent','green']}
            style={zoneColor(SCREEN_HEIGHT/4)}
        />
        
        <Text style={[styles.text, {top: 10}]}>RA</Text>
        <Animated.View 
            style={[position.getLayout(),styles.card,
                { transform : [{scale}] , opacity: cardOpacity }]}
            {...pan.panHandlers}
        />
        <Text style={[styles.text, {bottom: 10}]}>VÀO</Text>

        <InputModal
            showModal={modalVisible}
            title={isIn ? 'Tiền Ra' : 'Tiền Vào'}
            input={amountMoney}
            inputChange={setAmountMoney}
            note={note}
            noteChange={setNote}
            confirm={modalConfirm}
            onClose={() => setModalVisible(false)}
        >
            {!isIn
            ? (
                <FlatList
                    data={tags}
                    keyExtractor={(data,i) => String(data) + i}
                    contentContainerStyle={{marginHorizontal: 7}}
                    horizontal
                    renderItem={({item}) => {
                        return (
                            <View style={{marginHorizontal: 2}}>
                                <Chip
                                    onPress={() => {
                                        if(currentTag.includes(item)) setCurrentTag(currentTag.filter(val => val !== item))
                                        else setCurrentTag([...currentTag, item])
                                    }}
                                    title={item}
                                    type={currentTag.includes(item) ? 'solid' : 'outline'} 
                                    
                                />
                            </View>
                        )
                    }}
                />
            )
            : null  
            }
        </InputModal>
    </SafeAreaView>
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
        width: 240,
        height: 160, 
        zIndex: 0,
        borderRadius: 5,
        backgroundColor: 'dodgerblue'
    },
    text: {
        position: 'absolute',
        zIndex: -1,
        margin: 10,
        fontSize: 27,
        opacity: 0.2
    }
})

export default HomeScreen