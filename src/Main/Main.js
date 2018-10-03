import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Landing from '../Landing/Landing';
import Predict from '../Predict/Predict';
import Train from '../Train/Train';
import Data from '../Data/Data';
import NotFound from '../NotFound/NotFound';

const styles = {
  root: {
    height: 'auto'
  }
};

class Main extends React.Component {
  render() {
    const { classes } = this.props;
    return(
      <main className={classes.root}>
        <Switch>
          <Route exact path='/' component={Landing}/>
          <Route path='/predict' component={Predict}/>
          <Route path='/train' component={Train}/>
          <Route path='/data' component={Data}/>
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
