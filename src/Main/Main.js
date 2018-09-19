import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import Predict from '../Predict/Predict';
import Train from '../Train/Train';
import Logo from '../Logo/Logo';
import NotFound from '../NotFound/NotFound';
import './Main.css';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    flexGrow: 1,
    maxWidth: 600,
    padding: theme.spacing.unit * 2,
  },
  image: {
    width: 128,
    height: 128,
  },
  img: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  },
});

class Main extends React.Component {
  render() {
    const { classes } = props;
    return(
      <main>
        <Switch>
          <Route exact path='/' component={Logo}/>
          <Route path='/predict' component={Predict}/>
          <Route path='/train' component={Train}/>
          <Route component={NotFound} />
        </Switch>
      </main>
    );
  }
}

export default withStyles(styles)(Main);