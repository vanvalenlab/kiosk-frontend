import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Logo from '../Logo/Logo';
import Predict from '../Predict/Predict';
import Train from '../Train/Train';
import NotFound from '../NotFound/NotFound';

const styles = {
  root: {
    minHeight: '80vh'
  }
};

class Main extends React.Component {
  render() {
    const { classes } = this.props;
    return(
      <main className={classes.root}>
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

Main.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Main);
