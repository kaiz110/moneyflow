import React,{ useEffect, createRef } from 'react'
import { View, StyleSheet, Modal, TouchableWithoutFeedback, ScrollView } from 'react-native'
import { Input, Button, Text } from 'react-native-elements'

const InputModal = ({title, confirm ,input, inputChange, note, noteChange, showModal, onClose , children}) => {
    const inputRef = createRef()

    useEffect(() => {
        if(inputRef.current){
            inputRef.current.focus()
        }
    },[showModal])

    return (
        <Modal
            animationType='fade'
            transparent
            visible={showModal}
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.background}/>
            </TouchableWithoutFeedback>

            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <View style={styles.container}>
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{alignItems: 'center'}}>
                        <Text h3 style={{margin: 10}}>{title}</Text>
                        <Input
                            ref={inputRef}
                            value={input}
                            onChangeText={inputChange}
                            label='Số tiền'
                            keyboardType='number-pad'
                        />
                        <Input
                            value={note}
                            onChangeText={noteChange}

                            multiline

                            label='Ghi chú'
                        />

                        {children}

                        <View style={{flexDirection: 'row'}}>
                            <Button
                                containerStyle={styles.button}
                                title='CANCEL'
                                onPress={onClose}
                            />
                            <Button
                                containerStyle={styles.button}
                                title='OK'
                                onPress={confirm}
                            />
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    button: {
        width: '29%',
        margin: 20
    },
    container: {
        width: '90%',
        marginVertical: 15,
        borderRadius: 10,
        backgroundColor: 'white'
    }
})

export default InputModal