import React from "react";
import { createMaterialTopTabNavigator, createBottomTabNavigator, createAppContainer, createStackNavigator, createSwitchNavigator } from "react-navigation";
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons, Entypo, MaterialCommunityIcons } from '@expo/vector-icons'
import * as Auth from '../AuthScreens'
import * as MessengerScreens from '../messengerScreens'
import { connect } from 'react-redux'


const ChatRoom = createStackNavigator({
    ChatRoom: {
        screen: MessengerScreens.ChatRoom,
        navigationOptions: () => ({
            headerRight: (
                <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity style={{marginRight: 20,padding: 7,borderRadius: 100, backgroundColor: '#EFF0EF'}}>
                <Entypo name="camera" size={20} color='black' />
                    </TouchableOpacity>
                    <TouchableOpacity style={{marginRight: 20,padding: 7, borderRadius: 100, backgroundColor: '#EFF0EF'}}>
                <MaterialCommunityIcons name="pencil" size={20} color='black' />
                    </TouchableOpacity>
                    <TouchableOpacity style={{marginRight: 20,padding: 7, borderRadius: 100, backgroundColor: '#EFF0EF'}}>
                     <Auth.LogOut />
                    </TouchableOpacity>
                </View>
            ),
        }),
    },
})

const ChatList = createStackNavigator({
    Chat: {
        screen: MessengerScreens.ChatList,
        navigationOptions: () => ({
            headerRight: (
                <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity style={{marginRight: 20,padding: 7,borderRadius: 100, backgroundColor: '#EFF0EF'}}>
                <Entypo name="camera" size={20} color='black' />
                    </TouchableOpacity>
                    <TouchableOpacity style={{marginRight: 20,padding: 7, borderRadius: 100, backgroundColor: '#EFF0EF'}}>
                <MaterialCommunityIcons name="pencil" size={20} color='black' />
                    </TouchableOpacity>
                    <TouchableOpacity style={{marginRight: 20,padding: 7, borderRadius: 100, backgroundColor: '#EFF0EF'}}>
                     <Auth.LogOut />
                    </TouchableOpacity>
                </View>
            ),
        }),
    }
})
const TabsPeople = createMaterialTopTabNavigator({
    Stories: {
        screen: MessengerScreens.Stories,
        navigationOptions: {
            tabBarLabel: ({ tintColor }) =>
                <View style={{ backgroundColor: tintColor, width: '75%', padding: 3, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: tintColor === 'white' ? '#9FA19F' : 'black', fontWeight: 'bold' }}>STORIES</Text>
                </View>
        },
    },
    AcitveUsers: {
        screen: MessengerScreens.AcitveUsers,
        navigationOptions: {
            tabBarLabel: ({ tintColor }) =>
                <View style={{ backgroundColor: tintColor, width: '75%', padding: 3, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: tintColor === 'white' ? '#9FA19F' : 'black', fontWeight: 'bold' }}>Active</Text>
                </View>
        },
    },
}, {
        swipeEnabled: false,
        animationEnabled: false,
        tabBarOptions: {
            activeTintColor: '#EFF0EF',
            inactiveTintColor: 'white',
            style: {
                backgroundColor: 'none',
            },
            tabStyle: {
                borderBottomWidth: 0,
                backgroundColor: 'white',
                height: 70,
            },
            indicatorStyle: {
                backgroundColor: 'none',
            }

        }

    })
const People = createStackNavigator({
    Screen: {
        screen: TabsPeople,
        navigationOptions: () => ({
            title: `People`,
            headerRight: (
                <View style={{flexDirection: 'row'}}>
                    <View style={{marginRight: 20,padding: 7,borderRadius: 100, backgroundColor: '#EFF0EF'}}>
                <Entypo name="message" size={20} color='black' />
                    </View>
                    <View style={{marginRight: 20,padding: 7, borderRadius: 100, backgroundColor: '#EFF0EF'}}>
                <Ionicons name="md-person-add" size={20} color='black' />
                    </View>
                </View>
            ),
            headerLeft : (
                <Image source={require('../assets/adduser.png')}  color='black' style={{height: 40, width: 40, marginLeft: 15, borderRadius: 100}} />
            )
        }),
    },
})


const MainTabBottom = createBottomTabNavigator({
    ChatList: {
        screen: ChatList,
        navigationOptions: {
            tabBarLabel: ({ tintColor }) => <Ionicons name="ios-chatbubbles" size={40} color={tintColor} />
        },
    },
    People: {
        screen: People,
        navigationOptions: {
            tabBarLabel: ({ tintColor }) => <Ionicons name="md-people" size={40} color={tintColor} />
        },
    },

},
    {
        tabBarOptions: {
            activeTintColor: 'black',
            style: {
                borderTopWidth: 0,
                height: 75
            },
            tabStyle: {
                alignItems: 'center',
                paddingBottom: 20,
            }
        }
    }
);
const MainSwitch = createSwitchNavigator({
    authVerify: Auth.AuthVerify,
    login: Auth.Login,
    signup: Auth.SignUp,
    messenger: MainTabBottom,
    ChatRoom: ChatRoom,
    map: MessengerScreens.Map
},{
    backBehavior: 'history'
})

const mapStateToProps = (state) => {
    return {
        user: state.reducer.user,
        chatUser: state.reducer.chatUser
    }
  }
  
  const mapDispatchToProps = (dispatch) => {
    return {
        updateuser: (user) => dispatch(updateuser(user)),
    }
  }
  
  
  
  export default connect(mapStateToProps, mapDispatchToProps)(createAppContainer(MainSwitch))