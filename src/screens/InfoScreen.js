import React, { useEffect } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { useSelector } from 'react-redux'

const InfoScreen = () => {
    const out = useSelector(state => state.fund.out)


    return <View>
        <Text>Số tiền ra: {out}</Text>
    </View>
}

const styles = StyleSheet.create({})

export default InfoScreen