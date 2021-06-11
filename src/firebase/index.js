import firebase from 'firebase'

export function upload(cate, data) {
    const uid = firebase.auth().currentUser.uid
    firebase.database().ref(`/users/${uid}/${cate}`).set(data)
    .then(() => console.log('set successed!'))
    .catch(err => console.log('err', err)) 
}

export function getValue(call) {
    const uid = firebase.auth().currentUser.uid
    firebase.database().ref(`/users/${uid}`).once('value', call)
}