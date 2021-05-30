import React from 'react'
import { View, Text, StyleSheet, Modal } from 'react-native'
import { Overlay } from 'react-native-elements'

const InputModal = ({isVisible, onBackdropPress}) => {
    return <Overlay
        isVisible={false}
        onBackdropPress={onBackdropPress}
    >
        <Text>Text from overlay !!@!!!!</Text>
    </Overlay>
}

export default InputModal