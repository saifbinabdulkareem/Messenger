import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image, FlatList } from 'react-native';
import { objForChat } from '../Redux/actions/authAction'
import { connect } from 'react-redux'
import { TouchableOpacity } from 'react-native-gesture-handler';
import firebase from '../Config/firebase';
import 'firebase/firestore';
import { createRoom } from '../Api/firebase';

const db = firebase.firestore();
class ChatList extends React.Component {
  constructor() {
    super();
    this.state = {
      usersArray: [],
    }
    this.updateState = this.updateState.bind(this)
  }
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Chats',
      headerLeft : (
       <View>
         {navigation.state.params &&<Image source={{uri: navigation.state.params.profilePic}}  color='black' style={{height: 40, width: 40, marginLeft: 15, borderRadius: 100}} />}
       </View> 
    )
    };
  };

  componentDidMount() {
    this.props.navigation.setParams(this.props.user)
    const myUid = this.props.user.uid;
    this.getUsers(myUid)
  }
  updateState(usersArray) {
    this.setState({ usersArray })
  }
  getUsers(myUid) {
    let updateStateFromDb = this.updateState
    db.collection('users').onSnapshot(function (querySnapshot) {
      const usersArry = [];
      querySnapshot.forEach(function (doc) {
        if (doc.data().uid !== myUid) {
          usersArry.push(doc.data());
        }
      });
      updateStateFromDb(usersArry)
    })
  }
  async startChat(chatUser) {
    const friendId = chatUser.uid;
    const myId = this.props.user.uid;
    try {
      let chatRoom = await createRoom(friendId, myId)
      this.props.objForChat({ chatRoom, chatUser })
      this.props.navigation.navigate('ChatRoom')
    } catch (e) {
      console.log(e)
    }
  }

  ChatListRender() {
    const { usersArray } = this.state
    return (<View style={{ paddingTop: 10 }}>
      <FlatList
        data={usersArray}
        renderItem={({item}) =>
          <TouchableOpacity
            onPress={() => { this.startChat(item) }}
            style={{ height: 60, padding: 5, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
            <View
              style={{ flex: 1 }}>
              <Image
                source={{uri: item.profilePic}}
                color='black'
                style={{ height: 60, width:60, marginLeft: 15, borderRadius: 100 }} />
            </View>
            <View
              style={{ flex: 4 }}>
              <Text
                style={{ fontSize: 18 }}>
                {item.name}
              </Text>
            </View>
          </TouchableOpacity>
        }
        keyExtractor={(item, index) => index.toString()}
      />

    </View>
    )
  }
  render() {
    return (
      <ScrollView>
        <View style={{ flex: 1 }}>
          {this.ChatListRender()}
        </View>
      </ScrollView>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    user: state.reducer.user
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    objForChat: (chatObj) => dispatch(objForChat(chatObj))
  }
}



export default connect(mapStateToProps, mapDispatchToProps)(ChatList)