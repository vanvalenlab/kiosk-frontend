import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import loadable from '@loadable/component';

const Footer = loadable(() => import('../Footer/Footer'));
const NavBar = loadable(() => import('../NavBar/NavBar'));
const Landing = loadable(() => import('../Landing/Landing'));
const Predict = loadable(() => import('../Predict/Predict'));
const Data = loadable(() => import('../Data/Data'));
const NotFound = loadable(() => import('../NotFound/NotFound'));

const styles = theme => ({
  root: {
    display: 'flex',
    minHeight: '100vh',
    flexDirection: 'column'
  },
  main: {
    flexGrow: 1,
  }
});

class Main extends React.Component {
  render() {
    const { classes } = this.props;
    return(
      <div className={classes.root}>
        <CssBaseline />
        <NavBar />
        <main className={classes.main}>
          <Switch>
            <Route exact path='/' component={Landing}/>
            <Route path='/predict' component={Predict}/>
            <Route path='/data' component={Data}/>
            <Route component={NotFound} />
          </Switch>
        </main>
        <Footer />
      </div>
    );
  }
}

Main.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Main);
