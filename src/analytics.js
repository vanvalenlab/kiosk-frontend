// https://raptis.wtf/blog/custom-hook-to-connect-google-analytics-in-react/
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga';

function init() {
  // Enable debug mode on the local development environment
  const isDev = process.env.NODE_ENV !== 'production';

  const gaTrackingId = !isDev
    ? window.REACT_APP_GA_TRACKING_ID
    : process.env.REACT_APP_GA_TRACKING_ID || 'UA-000000000-0';

  ReactGA.initialize(gaTrackingId, {
    debug: isDev,
    testMode: process.env.NODE_ENV === 'test',
  });
}

// TODO: how to send events through a hook?
// function sendEvent(payload) {
//   ReactGA.event(payload);
// }

function sendPageview(path) {
  ReactGA.set({ page: path });
  ReactGA.pageview(path);
}

export default function useGoogleAnalytics() {
  const location = useLocation();

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    const currentPath = location.pathname + location.search;
    sendPageview(currentPath);
  }, [location]);
}
