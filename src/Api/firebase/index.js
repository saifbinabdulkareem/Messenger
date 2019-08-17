import firebase from '../../Config/firebase';
import 'firebase/firestore';

const db = firebase.firestore();
const storage = firebase.storage();
const auth = firebase.auth();

function loginWithFacebookFirebasse(credential) {
    return new Promise((resolve, reject) => {
        auth.signInWithCredential(credential).then(e => {
            if (e.additionalUserInfo.isNewUser) {
                const obj = {
                    email: e.additionalUserInfo.profile.email,
                    createdAt: Date.now(),
                    uid: e.user.uid,
                    profilePic: e.additionalUserInfo.profile.picture.data.url,
                    name: e.additionalUserInfo.profile.name,
                    profilePicName: 'facebook'
                }
                db.collection("users").doc(e.user.uid).set(obj).then(() => {
                    resolve(obj)
                })
            } else {
                db.collection("users").doc(e.user.uid).get().then(function (doc) {
                    if (doc.exists) {
                        const obj = doc.data();
                        const data = {
                            createdAt: obj.createdAt,
                            email: obj.email,
                            uid: obj.uid,
                            profilePic: obj.profilePic,
                            name: obj.name,
                            profilePicName: obj.profilePicName
                        }
                        resolve(data)
                    }
                })
            }
        })
            .catch((error) => {
                reject(error)
            });
    })
}

function loginAccount(email, password) {
    return new Promise((resolve, reject) => {
        auth.signInWithEmailAndPassword(email, password).then(e => {
            db.collection("users").doc(e.user.uid).get().then(function (doc) {
                if (doc.exists) {
                    const obj = doc.data();
                    const data = {
                        createdAt: obj.createdAt,
                        email: obj.email,
                        uid: obj.uid,
                        profilePic: obj.profilePic,
                        name: obj.name,
                        profilePicName: obj.profilePicName
                    }
                    resolve(data)
                }
            }).catch(function (e) {
                reject(e)
            })
        }).catch((e) => {
            reject(e)
        })
    })
}

function register(data, blob) {
    return new Promise((resolve, reject) => {
        auth.createUserWithEmailAndPassword(data.email, data.password).then(user => {
            console.log(user.user.uid)
            const obj = {
                email: data.email,
                createdAt: Date.now(),
                uid: user.user.uid,
                name: data.name
            }
            storage.ref(`profilePics/${obj.uid}`).child(`${obj.createdAt}`).put(blob).then((e) => {
                console.log('storage ===> ', e)
                e.ref.getDownloadURL().then((url) => {
                    obj.profilePic = url
                    obj.profilePicName = e.metadata.name
                    console.log('getUrl === ', url)
                    db.collection("users").doc(obj.uid).set(obj).then((e) => {
                        console.log('database ==> ', e)
                        resolve(true)
                    })
                        .catch((e) => {
                            reject(e)
                        })
                })
            })
                .catch((e) => {
                    reject(e)
                })
        })
            .catch((e) => {
                reject(e)
            })
    })
}
function createRoom(friendId, myId) {
    let chatExists = false;
    return new Promise((resolve, reject) => {
        db.collection('chatrooms')
            .where('users.' + myId, '==', true)
            .where('users.' + friendId, '==', true).get().then(snapshot => {
                snapshot.forEach(elem => {
                    chatExists = { data: elem.data(), roomId: elem.id };
                })
                if (!chatExists) {
                    const obj = {
                        createdAt: Date.now(),
                        users: {
                            [friendId]: true,
                            [myId]: true
                        }
                    }
                    db.collection('chatrooms').add(obj).then(snapshot => {
                        resolve({ data: obj, roomId: snapshot.id })
                    })
                } else {
                    resolve(chatExists);
                }
            })
    })
}

function sendMessageToDb(roomId, message, myId) {
    const obj = {
        roomId,
        text: true,
        image: false,
        location: false,
        message,
        userId: myId,
        timeStamp: Date.now()
    }
    return db.collection('chatrooms').doc(roomId).collection('messages').add(obj)
}
function sendLocationToDb(roomId, location, myId){
    const obj = {
        roomId,
        text: false,
        image: false,
        location: true,
        latlang: location,
        userId: myId,
        timeStamp: Date.now()
    }
    return db.collection('chatrooms').doc(roomId).collection('messages').add(obj)
}
function sendImageToDb(roomId, image, myId) {
    const obj = {
        roomId,
        text: false,
        image: true,
        location: false,
        imageName: '',
        userId: myId,
        timeStamp: Date.now()
    }
    storage.ref(`ChatRoomsImages/${roomId}/${obj.userId}`).child(`${obj.timeStamp}`).put(image).then((e) => {
        e.ref.getDownloadURL().then((url) => {
            obj.message = url
            obj.imageName = e.metadata.name
            db.collection('chatrooms').doc(roomId).collection('messages').add(obj)
        })
    })
            
}
function sendStoryToDb(user, story){
    const obj = {
        uid: user.uid,
        name: user.name,
        profilePic: user.profilePic,
        timeStamp: Date.now()
    }
    storage.ref(`Stories/${user.uid}`).child(`${obj.timeStamp}`).put(story).then(e =>{
        e.ref.getDownloadURL().then(url =>{
            obj.story = url,
            obj.StorageKey = e.metadata.name
            db.collection('Stories').add(obj)
        })
    })
}

export {
    loginAccount,
    register,
    createRoom,
    sendMessageToDb,
    loginWithFacebookFirebasse,
    sendImageToDb,
    sendLocationToDb,
    sendStoryToDb
}