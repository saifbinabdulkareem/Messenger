import React from 'react';
import Main from './src'
import _ from 'lodash';
import { YellowBox } from 'react-native';

YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};
export default class App extends React.Component {
  render(){
    return(
      <Main />
    )
  }
}
