import React, { useState, useEffect } from 'react'
import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native'
import { Button, Text, Chip, Overlay } from 'react-native-elements'
import { useSelector, useDispatch } from 'react-redux'
import { addTag, editTag, delTag, clearAll } from '../redux/actions'
import InputModal from '../components/InputModal'
import firebase from 'firebase'
import AntDesign from '@expo/vector-icons/AntDesign'
import { upload, getValue } from '../firebase'
import { LogBox } from 'react-native';

LogBox.ignoreLogs(['Setting a timer']);


const SettingScreen = () => {
    const dispatch = useDispatch()
    const tags = useSelector(state => state.tags)
    const history = useSelector(state => state.history)

    const [ tag, setTag ] = useState('')
    const [ showAdd, setShowAdd ] = useState('')
    const [ showEdit, setShowEdit ] = useState('')
    const [ currentTag, setCurrentTag ] = useState('')
    const [ modalDel, setModalDel ] = useState(false)


    useEffect(() => {
        upload('tags',tags)
    },[tags])

    const onConfirm = (addOrEdit) => {
        if(addOrEdit == 'edit') dispatch(editTag(tag, currentTag))
        else dispatch(addTag(tag))

        onClose()
    }

    const onClose = () => {
        setShowAdd(false)
        setShowEdit(false)
        setTag('')
        setCurrentTag('')
    }

    const getSum = (data, type) => {
        let sum = 0
        for(let i = 0 ; i < data.length ; i++){
            if(data[i].type === type) sum += data[i].amount
        }
        return sum
    }

    return <View>
        <View style={{flexDirection: 'row'}}>
            <Text style={styles.title}>Tổng tiền đã tiêu :</Text>
            <Text style={styles.title}>{getSum(history, 'OUT')}</Text>
        </View>
        
        <View style={{flexDirection: 'row'}}>
            <Text style={styles.title}>Tổng tiền đã nhận :</Text>
            <Text style={styles.title}>{getSum(history, 'IN')}</Text>
        </View>

        <Text style={styles.title}>Tag</Text>

        <FlatList
            data={tags}
            keyExtractor={data => data}
            contentContainerStyle={{margin: 5, borderWidth: 1, borderColor: 'grey'}}
            ListFooterComponent={() => {
                return <Button
                    title='Thêm'
                    type='clear'
                    onPress={() => setShowAdd(true)}
                />
            }}
            renderItem={({item}) => {
                return (
                <TouchableOpacity style={styles.cardTag} 
                    onPress={() => { 
                        setTag(item)
                        setCurrentTag(item) 
                        setShowEdit(true) 
                    }}
                >
                    <Text style={{fontSize: 16,marginLeft: 25}}>{item}</Text>
                    <TouchableOpacity onPress={() => dispatch(delTag(item))}>
                        <AntDesign name='delete' size={25}/>
                    </TouchableOpacity>
                </TouchableOpacity>
                )
            }}
        />

        <Button
            title='Xóa dữ liệu'
            buttonStyle={{margin: 20, marginBottom: 0}}
            onPress={() => setModalDel(true)}
        />

        <Button
            title='Đăng xuất'
            buttonStyle={{margin: 20}}
            onPress={() => firebase.auth().signOut()}
        />

        <Overlay isVisible={modalDel} onBackdropPress={() => setModalDel(false)}>
            <Text style={{fontSize: 16, margin: 10, fontWeight: 'bold'}}>Có muốn xóa hết dữ liệu không?</Text>
            <Button
                title='Có'
                onPress={() => {
                    dispatch(clearAll())
                    setModalDel(false)
                }}
            />
        </Overlay>

        <InputModal
            showModal={showAdd}
            title='Thêm thẻ'
            note={tag}
            noteChange={setTag}
            secondLabel=''
            confirm={() => onConfirm('add')}
            onClose={onClose}
        />

        <InputModal
            showModal={showEdit}
            title='Sửa thẻ'
            note={tag}
            noteChange={setTag}
            secondLabel=''
            confirm={() => onConfirm('edit')}
            onClose={onClose}
        />
    </View>
}

const styles = StyleSheet.create({
    cardTag: {
        flexDirection: 'row', 
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        padding: 10
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        margin: 5
    }
})

export default SettingScreen