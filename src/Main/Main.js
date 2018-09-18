import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Predict from '../Predict/Predict';
import Logo from '../Logo/Logo';

export default class Main extends React.Component {
  render() {
    return(
      <main style={{ minHeight: '80vh' }}>
        <Switch>
          <Route exact path='/' component={Predict}/>
          <Route path='/predict' component={Predict}/>
          <Route path='/train' component={Logo}/>
        </Switch>
      </main>
    );
  }
}
