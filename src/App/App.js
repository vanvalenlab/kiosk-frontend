import React from 'react';
import { hot } from 'react-hot-loader';
import loadable from '@loadable/component';

const Main = loadable(() => import('../Main/Main'));

//If the mode is NOT production, then notify that we are in dev mode.
if (process.env.NODE_ENV !== 'production') {
  console.log('Looks like we are in development mode!');
}

class App extends React.Component {
  render() {
    return(
      <Main />
    );
  }
}

export default hot(module)(App);
