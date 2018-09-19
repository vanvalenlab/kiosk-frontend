import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import CssBaseline from '@material-ui/core/CssBaseline';
import Footer from '../Footer/Footer';
import NavBar from '../NavBar/NavBar';
import Main from '../Main/Main';

//If the mode is NOT production, then notify that we are in dev mode.
if (process.env.NODE_ENV !== 'production') {
  console.log('Looks like we are in development mode!');
}

class App extends Component {
  render() {
    return(
      <React.Fragment>
        <CssBaseline />
        <NavBar />
        <Main />
        <Footer />
      </React.Fragment>
    );
  }
}

export default hot(module)(App);
