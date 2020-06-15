import React from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import App from './App/App';

const history = createBrowserHistory();

ReactGA.initialize('UA-169034632-1', {
  debug: process.env.NODE_ENV !== 'production',
});

// Initialize google analytics page view tracking
history.listen(location => {
  ReactGA.set({ page: location.pathname }); // Update the user's current page
  ReactGA.pageview(location.pathname); // Record a pageview for the given page
});

ReactDOM.render(
  <Router history={history}>
    <App />
  </Router>,
  document.getElementById('root')
);
