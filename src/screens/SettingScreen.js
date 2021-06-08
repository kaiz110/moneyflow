import React, {useState} from 'react'
import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native'
import { Button, Text, Chip } from 'react-native-elements'
import { useSelector, useDispatch } from 'react-redux'
import { addTag, editTag } from '../redux/actions'
import InputModal from '../components/InputModal'
import firebase from 'firebase'
import AntDesign from '@expo/vector-icons/AntDesign'


const SettingScreen = () => {
    const dispatch = useDispatch()
    const fund = useSelector(state => state.fund)
    const tags = useSelector(state => state.tags)

    const [ tag, setTag ] = useState('')
    const [ showAdd, setShowAdd ] = useState('')
    const [ showEdit, setShowEdit ] = useState('')
    const [ currentTag, setCurrentTag ] = useState('')

    const onConfirm = (addOrEdit,old) => {
        if(addOrEdit == 'edit') {
            dispatch(editTag(tag,old))
        }

        setShowEdit(false)
        setShowAdd(false)
    }

    const onClose = () => {
        setShowAdd(false)
        setShowEdit(false)
        setTag('')
        setCurrentTag('')
    }

    return <View>
        <View style={{flexDirection: 'row'}}>
            <Text style={styles.title}>Tổng tiền đã tiêu :</Text>
            <Text style={styles.title}>{fund.out}</Text>
        </View>
        
        <View style={{flexDirection: 'row'}}>
            <Text style={styles.title}>Tổng tiền đã nhận :</Text>
            <Text style={styles.title}>{fund.in}</Text>
        </View>

        <Text style={styles.title}>Tag Edit</Text>

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
                        setShowEdit(true) 
                        setCurrentTag(item) 
                        setTag(currentTag)
                    }}
                >
                    <Text style={{fontSize: 16,marginLeft: 25}}>{item}</Text>
                    <TouchableOpacity>
                        <AntDesign name='delete' size={25}/>
                    </TouchableOpacity>
                </TouchableOpacity>
                )
            }}
        />

        <Button
            title='Đăng xuất'
            buttonStyle={{margin: 20}}
            onPress={() => firebase.auth().signOut()}
        />

        <InputModal
            showModal={showAdd}
            title='Thêm thẻ'
            note={tag}
            noteChange={setTag}
            secondLabel=''
            confirm={onConfirm('add')}
            onClose={onClose}
        />

        <InputModal
            showModal={showEdit}
            title='Sửa thẻ'
            note={tag}
            noteChange={setTag}
            secondLabel=''
            confirm={onConfirm('edit',currentTag)}
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
        margin: 5
    }
})

export default SettingScreen