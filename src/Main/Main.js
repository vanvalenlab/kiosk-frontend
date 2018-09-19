import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Predict from '../Predict/Predict';
import Train from '../Train/Train';
import Logo from '../Logo/Logo';
import NotFound from '../NotFound/NotFound';
import './Main.css';

export default class Main extends React.Component {
  render() {
    return(
      <main>
        <Switch>
          <Route exact path='/' component={Logo}/>
          <Route path='/predict' component={Predict}/>
          <Route path='/train' component={Logo}/>
          <Route component={NotFound} />
        </Switch>
      </main>
    );
  }
}
