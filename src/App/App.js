import React, { lazy, Suspense, useEffect } from 'react';
import ReactGA from 'react-ga';
import { PropTypes } from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import SwaggerUI from 'swagger-ui-react';
import CssBaseline from '@material-ui/core/CssBaseline';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import 'swagger-ui-react/swagger-ui.css';

const About = lazy(() => import('../About/About'));
const Faq = lazy(() => import('../Faq/Faq'));
const Footer = lazy(() => import('../Footer/Footer'));
const NavBar = lazy(() => import('../NavBar/NavBar'));
const Landing = lazy(() => import('../Landing/Landing'));
const Predict = lazy(() => import('../Predict/Predict'));
const Data = lazy(() => import('../Data/Data'));
const NotFound = lazy(() => import('../NotFound/NotFound'));

// If the mode is NOT production, then notify that we are in dev mode.
if (process.env.NODE_ENV !== 'production') {
  console.log('Looks like we are in development mode!');
}

ReactGA.initialize(process.env.GA_TRACKING_ID || 'UA-000000000-0', {
  debug: process.env.NODE_ENV !== 'production',
  testMode: process.env.NODE_ENV === 'test',
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

  HOC.propTypes = {
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
    }),
  };

  return HOC;
};

const useStyles = makeStyles(theme => ({ // eslint-disable-line no-unused-vars
  root: {
    display: 'flex',
    minHeight: '100vh',
    flexDirection: 'column'
  },
  main: {
    flexGrow: 1,
  }
}));

export default function App() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Suspense fallback={<CircularProgress />}>
        <CssBaseline />
        <NavBar />
        <main className={classes.main}>
          <Switch>
            <Route exact path='/' component={withTracker(Landing)}/>
            <Route path='/about' component={withTracker(About)}/>
            <Route path='/faq' component={withTracker(Faq)}/>
            <Route path='/predict' component={withTracker(Predict)}/>
            <Route path='/data' component={withTracker(Data)}/>
            <SwaggerUI url='/api/swagger.json' />
            <Route component={withTracker(NotFound)} />
          </Switch>
        </main>
        <Footer />
      </Suspense>
    </div>
  );
}
