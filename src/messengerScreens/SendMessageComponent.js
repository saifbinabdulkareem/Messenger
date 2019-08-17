import React from 'react';
import { sendMessageToDb, sendImageToDb } from '../Api/firebase'
import { View, TextInput } from 'react-native'
import { connect } from 'react-redux'
import * as ImagePicker from 'expo-image-picker';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Entypo, Ionicons } from '@expo/vector-icons';


class SendMessageComponent extends React.Component {
    constructor() {
        super()
        this.state = {
            text: '',
            emoji: '',
        }
    }
    static getDerivedStateFromProps(nextProps, state){
        if(nextProps.emoji !== state.emoji){
            return {
                emoji: nextProps.emoji,
                text: state.text + nextProps.emoji
            }
        }else{
            return false
        }
    }
    async sendMessage() {
        await sendMessageToDb(this.props.chatRoomObj.chatRoom.roomId, this.state.text, this.props.user.uid)
        this.setState({ text: '' })
    }
    async pickImage() {
        try {
            const picImage = await ImagePicker.launchImageLibraryAsync()
            if (!picImage.cancelled) {
                const response = await fetch(picImage.uri);
                const blob = await response.blob()
                await sendImageToDb(this.props.chatRoomObj.chatRoom.roomId, blob, this.props.user.uid)
            }
        } catch (e) {
            console.log(e)
        }
    }
    async openCameraFunc() {
        try {
            const picImageFromCamera = await ImagePicker.launchCameraAsync()
            if (!picImageFromCamera.cancelled) {
                const response = await fetch(picImageFromCamera.uri);
                const blob = await response.blob()
                await sendImageToDb(this.props.chatRoomObj.chatRoom.roomId, blob, this.props.user.uid)
            }
        } catch (e) {
            console.log(e)
        }
    }

    render() {
        const { text } = this.state;

        return (
            <View
                style={{
                    height: 60,
                    width: '100%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>

                <TouchableOpacity onPress={() => { this.props.navigation.navigate('map') }} style={{ flex: 1, justifyContent: 'center', padding: 5 }}>
                    <Entypo name='location' size={20} color='#0084FF' />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.openCameraFunc()} style={{ flex: 1, justifyContent: 'center', padding: 5 }}>
                    <Ionicons name='ios-camera' size={30} color='#0084FF' />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.pickImage()} style={{ flex: 1, justifyContent: 'center', padding: 5 }}>
                    <Ionicons name='md-photos' size={25} color='#0084FF' />
                </TouchableOpacity>
                <TouchableOpacity style={{ flex: 1, justifyContent: 'center', padding: 5 }}>
                    <Entypo name='mic' size={20} color='#0084FF' />
                </TouchableOpacity>
                <View style={{ backgroundColor: '#EFF0EF', height: '65%', flex: 3, flexDirection: 'row', padding: 5, borderRadius: 100 }}>
                    <TextInput
                        value={text}
                        onChangeText={text => this.setState({text})}
                        onFocus={()=>this.props.showHideEmoji(false)}
                        style={{
                            padding: 5,
                            flex: 3,
                            backgroundColor: '#EFF0EF',
                            borderRadius: 100,
                            color: 'black'
                        }}
                        placeholder={'A a'}
                    />
                    <TouchableOpacity
                    onPress={()=>this.props.showHideEmoji(!this.props.emojiInput)}
                    style={{ flex: 1, justifyContent: 'center', padding: 5 }}>
                        <Entypo name='emoji-happy' size={20} color='#0084FF' />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => this.sendMessage()} style={{ flex: 1, justifyContent: 'center', padding: 5 }}>
                    <Ionicons name='ios-send' size={25} color='#0084FF' />
                </TouchableOpacity>
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.reducer.user,
        chatRoomObj: state.reducer.chatRoomObj
    }
}
export default connect(mapStateToProps)(SendMessageComponent)