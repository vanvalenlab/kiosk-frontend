import React, { lazy, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import CircularProgress from '@mui/material/CircularProgress';
import { ThemeProvider, StyledEngineProvider, createTheme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import useGoogleAnalytics from '../analytics';

const About = lazy(() => import('../About/About'));
const Faq = lazy(() => import('../Faq/Faq'));
const Footer = lazy(() => import('../Footer/Footer'));
const NavBar = lazy(() => import('../NavBar/NavBar'));
const Landing = lazy(() => import('../Landing/Landing'));
const Predict = lazy(() => import('../Predict/Predict'));
const Swagger = lazy(() => import('../Swagger/Swagger'));
// const Data = lazy(() => import('../Data/Data'));
const NotFound = lazy(() => import('../NotFound/NotFound'));

// If the mode is NOT production, then notify that we are in dev mode.
if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line no-console
  console.log('Looks like we are in development mode!');
}

const theme = createTheme();

const useStyles = makeStyles((theme) => ({ // eslint-disable-line no-unused-vars
  root: {
    display: 'flex',
    minHeight: '100vh',
    flexDirection: 'column'
  },
  main: {
    flexGrow: 1,
  }
}));

function KioskFrontend() {
  const classes = useStyles();

  useGoogleAnalytics();

  return (
    <div className={classes.root}>
      <Suspense fallback={<CircularProgress />}>
        <CssBaseline />
        <NavBar />
        <main className={classes.main}>
          <Switch>
            <Route exact path='/' component={Landing}/>
            <Route path='/about' component={About}/>
            <Route path='/faq' component={Faq}/>
            <Route path='/predict' component={Predict}/>
            <Route path='/docs' component={Swagger} />
            <Route component={NotFound} />
          </Switch>
        </main>
        <Footer />
      </Suspense>
    </div>
  );
}

function App() {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}><KioskFrontend /></ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;