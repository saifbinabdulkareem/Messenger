import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native'
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { connect } from 'react-redux'
import { sendLocationToDb } from '../Api/firebase'


class Map extends React.Component {
  constructor() {
    super();
    this.state = {
      location: null,
    }
  }
  async sendMessage() {
    await sendLocationToDb(this.props.chatRoomObj.chatRoom.roomId, this.state.location, this.props.user.uid)
    this.setState({ location: null },()=>{
      this.props.navigation.navigate('ChatRoom')
    })
}
  componentWillMount() {
    this.getLocation()
  }
  async getLocation() {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    let obj = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.004,
      longitudeDelta: 0.004
    }
    this.setState({ location: obj});
  }
  render() {
    console.log(this.state.location)
    return (
      <View style={{flex: 1}}>
        <View style={{flex: 4}}>
      <MapView style={{ flex: 1 }}
      region={this.state.location}
      >
        {this.state.location !== null &&
          <Marker
          coordinate={{latitude: this.state.location.latitude, longitude: this.state.location.longitude}}
          />
        }
      </MapView>
        </View>
      <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-around'}}>
        <View style={{justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity onPress={()=>{
            this.props.navigation.navigate('ChatRoom')
          }} style={{width: 50, height: 50, borderRadius: 100, backgroundColor: 'red',justifyContent: 'center', alignItems: 'center'}}>
            <Text>X</Text>
          </TouchableOpacity>
        </View>
        <View style={{justifyContent: 'center', alignItems: 'center' }}>
        <TouchableOpacity onPress={()=>{
          this.sendMessage()
        }} style={{width: 100, height: 100, borderRadius: 100, backgroundColor: 'Blue',justifyContent: 'center', alignItems: 'center'}}>
            <Text>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
      user: state.reducer.user,
      chatRoomObj: state.reducer.chatRoomObj
  }
}
export default connect(mapStateToProps)(Map)