import React from 'react';
import { StyleSheet, Text, View, Image, FlatList } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import { sendStoryToDb } from '../Api/firebase'
import firebase from '../Config/firebase';
import 'firebase/firestore';
const db = firebase.firestore();




class Stories extends React.Component {
  constructor() {
    super();
    this.state = {
      usersArray: [],
      Stories: []
    }
    this.updateState = this.updateState.bind(this)
    this.StoriesUpdate = this.StoriesUpdate.bind(this)
  }


  componentDidMount() {
    this.getUsers(this.props.user.uid)
    this.getStories()
  }
  StoriesUpdate(Stories) {
    this.setState({ Stories })
  }
  getStories() {
    let updateStoriestoState = this.StoriesUpdate
    db.collection('Stories').onSnapshot(function (querySnapshot) {
      const Stories = [];
      querySnapshot.forEach(function (doc) {
        Stories.push(doc.data())
      }
      )
      updateStoriestoState(Stories)
    }
    )
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
  async pickImage() {
    try {
      const picImage = await ImagePicker.launchImageLibraryAsync()
      if (!picImage.cancelled) {
        const response = await fetch(picImage.uri);
        const blob = await response.blob()
        await sendStoryToDb(this.props.user, blob)
      }
    } catch (e) {
      console.log(e)
    }
  }

  render() {
    return (
      <ScrollView style={{ flex: 1, }}>
        <View style={{ flex: 1 }}>
          <View style={{ width: '40%', height: 250, borderWidth: 2, borderColor: 'black', margin: 10, borderRadius: 20, overflow: 'hidden' }}>
            <TouchableOpacity onPress={() => { this.pickImage() }}>
              <View>
                <Image source={{ uri: this.props.user.profilePic }} style={{ height: '100%', width: '100%' }} />
              </View>
              <View style={{ position: 'absolute', top: 0, left: 0, alignItems: 'center', backgroundColor: 'black', borderRadius: 100, height: 50, width: 50, justifyContent: 'center' }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>+</Text>
              </View>
              <View style={{ position: 'absolute', color: 'white', bottom: 0, left: 0, right: 0, alignItems: 'center', justifyContent: 'center' }} >
                <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Add Stories</Text>
              </View>
            </TouchableOpacity>
          </View>
          {!!this.state.Stories.length &&
            <FlatList
              data={this.state.Stories}
              renderItem={({ item }) =>
                <View style={{ width: '40%', height: 250, borderWidth: 2, borderColor: 'black', margin: 10, borderRadius: 20, overflow: 'hidden' }}>
                  <TouchableOpacity>
                    <View>
                      <Image source={{ uri: item.story }} style={{ height: '100%', width: '100%'}} />
                    </View>
                    <View style={{ position: 'absolute', top: 0, left: 0, alignItems: 'center', backgroundColor: 'black', borderRadius: 100, height: 50, width: 50, justifyContent: 'center' }}>
                      <Image source={{ uri: item.profilePic }} style={{ height: '100%', width: '100%' , borderRadius: 100 }} />
                    </View>
                    <View style={{ position: 'absolute', color: 'white', bottom: 0, left: 0, right: 0, alignItems: 'center', justifyContent: 'center' }} >
                      <Text style={{ color: 'white', fontSize: 14}}>{item.name}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              }
              keyExtractor={(item, index) => index.toString()}
            />
          }
        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.reducer.user,
  }
}
export default connect(mapStateToProps)(Stories)

