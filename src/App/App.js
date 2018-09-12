import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import './App.css';
import Facade from '../Facade/Facade';

//If the mode is NOT production, then notify that we are in dev mode.
if (process.env.NODE_ENV !== 'production') {
  console.log('Looks like we are in development mode!');
}

class App extends Component{
  render() {
    return(
      <div className='App'>
        <Facade />
      </div>
    );
  }
}

export default hot(module)(App);
