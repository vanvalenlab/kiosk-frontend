import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import loadable from '@loadable/component';

const Footer = loadable(() => import('../Footer/Footer'));
const NavBar = loadable(() => import('../NavBar/NavBar'));
const Main = loadable(() => import('../Main/Main'));

const styles = theme => ({
  root: {
    display: 'flex',
    minHeight: '100vh',
    flexDirection: 'column'
  }
});

class Container extends React.Component {
  render() {
    const { classes } = this.props;
    return(
      <div className={classes.root}>
        <CssBaseline />
        <NavBar />
        <Main />
        <Footer />
      </div>
    );
  }
}

Container.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Container);
