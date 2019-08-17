import React from 'react';
import MainSwitch from './Config/navigator'
import {Provider} from 'react-redux';
import { store, persistor } from './Redux/Store';
import { PersistGate } from 'redux-persist/integration/react'

export default function Main() {
  return (
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <MainSwitch />
      </PersistGate>
    </Provider>
  );
}