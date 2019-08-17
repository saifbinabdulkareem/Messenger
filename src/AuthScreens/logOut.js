import React from 'react';
import { TouchableOpacity } from 'react-native';
import { withNavigation } from 'react-navigation';
import { Entypo } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { removeUser } from '../Redux/actions/authAction';

class LogOut extends React.Component {
    logout() {
        try {
            this.props.removeUser();
            console.log('logOut');
            this.props.navigation.navigate('authVerify')
        }
        catch (e) {
            console.log(e)
        }
    }
    render() {
        return (
            <TouchableOpacity
                onPress={() => { this.logout() }}
            >
                <Entypo
                    name="log-out"
                    size={20}
                    color='black'
                />
            </TouchableOpacity>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.reducer.user
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        removeUser: () => dispatch(removeUser())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(LogOut))