import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, Alert} from 'react-native';
import { register } from '../Api/firebase'
import { connect } from 'react-redux'
import * as ImagePicker from 'expo-image-picker';


class SignUp extends React.Component {
    constructor() {
        super();
        this.state = {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            userImageUri: ''
        }
    }
    async getImage() {
        try {
            const picImage = await ImagePicker.launchImageLibraryAsync()
            if(!picImage.cancelled){
                this.setState({userImageUri: picImage.uri})
            }
        } catch (e) {
            console.log(e)
        }
    }
    ImageRender() {
        if (this.state.userImageUri === '') {
            return (
                <TouchableOpacity
                    onPress={() => { this.getImage() }}
                >
            <Image 
            style={{ height: 100, width: 100, borderWidth: 1, borderColor: 'grey', borderRadius: 100 }} 
            source={require('../assets/adduser.png')} 
            />
            </TouchableOpacity>
            )
        } else {
            return (
                <TouchableOpacity
                    onPress={() => { this.getImage() }} 
                >
            <Image 
            style={{ height: 100, width: 100, borderWidth: 1, borderColor: 'grey', borderRadius: 100 }} 
            source={{ uri: this.state.userImageUri }} 
            />
            </TouchableOpacity>
            )
        }
    }
    async signUp() {
        const { name,email, password, confirmPassword, userImageUri } = this.state;
        if (password !== '' && password === confirmPassword && name !== ''&& userImageUri !== ''&& email !== '') {
            try {
                const response = await fetch(userImageUri);
                const blob = await response.blob()
                const data = {
                    email,
                    password,
                    name,
                }
                
                const isRegister = await register(data , blob)
                if (isRegister) {
                    this.props.navigation.navigate('authVerify')
                }
            } catch (e) {
                console.log(e.message)
            }

        } else {
            Alert.alert('Password does not match')
        }

    }
    render() {
        const { name, email, password, confirmPassword, userImageUri } = this.state
        return (
            <View style={styles.container}>
                <View style={{ flex: 0.8, justifyContent: 'center', alignItems: 'center' }}>
                    <Image style={{ height: 200, width: 200 }} source={require('../assets/Logo.png')} />
                </View>
                <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
                    {this.ImageRender()}
                    <TextInput
                        style={{ width: '90%', height: 50, margin: 5, backgroundColor: 'white', borderBottomColor: 'grey', borderBottomWidth: 1 }}
                        placeholder="Full Name"
                        onChangeText={name => this.setState({ name })}
                        value={name}
                    />
                    <TextInput
                        style={{ width: '90%', height: 50, margin: 5, backgroundColor: 'white', borderBottomColor: 'grey', borderBottomWidth: 1 }}
                        placeholder="Email"
                        onChangeText={email => this.setState({ email })}
                        value={email}
                    />
                    <TextInput
                        style={{ width: '90%', height: 50, margin: 5, backgroundColor: 'white', borderBottomColor: 'grey', borderBottomWidth: 1 }}
                        placeholder="Password"
                        secureTextEntry={true}
                        onChangeText={password => this.setState({ password })}
                        password={password}
                    />
                    <TextInput
                        style={{ width: '90%', height: 50, margin: 5, backgroundColor: 'white' }}
                        placeholder="Confirm Password"
                        secureTextEntry={true}
                        onChangeText={confirmPassword => this.setState({ confirmPassword })}
                        password={password}
                    />
                    <View style={{ flexDirection: 'row' }}>

                        <TouchableOpacity
                            style={{ flex: 1, backgroundColor: 'red', width: '50%', borderRadius: 15, height: 50, justifyContent: 'center', alignItems: 'center', margin: 5 }}
                            onPress={() => this.props.navigation.navigate('login')}
                        >
                            <Text style={{ color: 'white' }}>CANCLE</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ flex: 1, backgroundColor: '#4BCC1E', width: '50%', borderRadius: 15, height: 50, justifyContent: 'center', alignItems: 'center', margin: 5 }}
                            onPress={() => this.signUp()}
                        >
                            <Text style={{ color: 'white' }}>SIGN UP</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
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
        user: state.reducer.user
    }
}

export default connect(mapStateToProps)(SignUp)