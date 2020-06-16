import React, { useEffect } from 'react';
import ReactGA from 'react-ga';
import CssBaseline from '@material-ui/core/CssBaseline';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { hot } from 'react-hot-loader';
import loadable from '@loadable/component';

const Faq = loadable(() => import('../Faq/Faq'));
const Footer = loadable(() => import('../Footer/Footer'));
const NavBar = loadable(() => import('../NavBar/NavBar'));
const Landing = loadable(() => import('../Landing/Landing'));
const Predict = loadable(() => import('../Predict/Predict'));
const Data = loadable(() => import('../Data/Data'));
const NotFound = loadable(() => import('../NotFound/NotFound'));

//If the mode is NOT production, then notify that we are in dev mode.
if (process.env.NODE_ENV !== 'production') {
  console.log('Looks like we are in development mode!');
}

ReactGA.initialize(process.env.GA_TRACKING_ID || 'UA-000000000-0', {
  debug: process.env.NODE_ENV !== 'production',
});

const withTracker = (WrappedComponent, options = {}) => {
  // https://github.com/react-ga/react-ga/wiki/React-Router-v4-withTracker
  const trackPage = page => {
    ReactGA.set({ page, ...options });
    ReactGA.pageview(page);
  };

  const HOC = props => {
    useEffect(() => trackPage(props.location.pathname), [
      props.location.pathname
    ]);

    return <WrappedComponent {...props} />;
  };

  return HOC;
};

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

class App extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <CssBaseline />
        <NavBar />
        <main className={classes.main}>
          <Switch>
            <Route exact path='/' component={withTracker(Landing)}/>
            <Route path='/faq' component={withTracker(Faq)}/>
            <Route path='/predict' component={withTracker(Predict)}/>
            <Route path='/data' component={withTracker(Data)}/>
            <Route component={withTracker(NotFound)} />
          </Switch>
        </main>
        <Footer />
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default hot(module)(withStyles(styles, { withTheme: true })(App));
