import React from 'react';
import {View} from 'react-native';
import { connect } from 'react-redux'

const AuthVerify = (props) =>{
    if(props.user){
        props.navigation.navigate('messenger')
    }else{
        props.navigation.navigate('login')
    }
    return(
        <View></View>
    )
}

const mapStateToProps = (state) => {
    return {
        user: state.reducer.user
    }
  }

  
  export default connect(mapStateToProps)(AuthVerify)