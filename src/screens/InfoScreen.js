import React, { useEffect } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { useSelector } from 'react-redux'

const InfoScreen = () => {
    const state = useSelector(state => state.fund)


    return <View>
        <Text>Số tiền hiện tại: {state}</Text>
    </View>
}

const styles = StyleSheet.create({})

export default InfoScreen