import React from 'react';
import { StyleSheet, SafeAreaView, KeyboardAvoidingView, ScrollView, View, Image } from 'react-native';
import Constants from 'expo-constants';
import { connect } from 'react-redux'
import ChatComponent from './ChatComponent'
import SendMessageComponent from './SendMessageComponent';
import EmojiSelector from 'react-native-emoji-selector'


class ChatRoom extends React.Component {
  constructor(){
    super();
    this.state = {
      emoji: '',
      emojiInput: false
    }
    this.showHideEmoji = this.showHideEmoji.bind(this)
  }  
  // addEmoji(e){
  //   const {emoji} = this.state
  //   emoji.push(e)
  // }
  static navigationOptions = ({ navigation }) => {
    console.log(navigation.state.params)
    return {
      title: navigation.state.params && navigation.state.params.name,
      headerLeft: (
        <View>
          {navigation.state.params && <Image source={{ uri: navigation.state.params.profilePic }} color='black' style={{ height: 40, width: 40, marginLeft: 15, borderRadius: 100 }} />}
        </View>
      ),
      headerStyle: {
        height: 62
      },
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    };
  };
  componentDidMount() {
    this.props.navigation.setParams(this.props.chatRoomObj.chatUser)
  }
  showHideEmoji(e){
    this.setState({emojiInput: e, emoji: ''})
  }
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView keyboardVerticalOffset={Constants.statusBarHeight + 62}
          style={styles.container} behavior="padding">
          <ScrollView invertStickyHeaders={false} style={styles.container} >
            <ChatComponent />
          </ScrollView>
          <SendMessageComponent navigation={this.props.navigation} showHideEmoji={this.showHideEmoji} emojiInput={this.state.emojiInput} emoji={this.state.emoji} />
        </KeyboardAvoidingView>
        {this.state.emojiInput &&
          <EmojiSelector
          style={{ height: 275}}
          showSearchBar={false}
          showHistory={true}
          columns={10}
          onEmojiSelected={emoji => this.setState({emoji})}
          />
        }
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const mapStateToProps = (state) => {
  return {
    user: state.reducer.user,
    chatRoomObj: state.reducer.chatRoomObj
  }
}

export default connect(mapStateToProps)(ChatRoom)