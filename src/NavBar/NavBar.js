import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { loadCSS } from 'fg-loadcss/src/loadCSS';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
// import MenuIcon from '@material-ui/icons/Menu';

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

class NavBar extends React.Component {
  componentDidMount() {
    loadCSS(
      'https://use.fontawesome.com/releases/v5.1.0/css/all.css',
      document.querySelector('#insertion-point-css'),
    );
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <AppBar position='static'>
          <Toolbar>
            <Typography variant='title' color='inherit' className={classes.grow}>
              <IconButton color='inherit' href='/'>
                DeepCell
              </IconButton>
            </Typography>
            <Button color='inherit' href='/predict'>
              Predict
            </Button>
            <Button color='inherit' href='/train'>
              Train
            </Button>
            <Button color='inherit' href='/data'>
              Data
            </Button>
            <Button color='inherit' href='/'>
              Jupyter
            </Button>
            <Button color='inherit' href='https://github.com/vanvalenlab' target='_blank'>
              <Icon className={classNames(classes.icon, 'fab fa-github fa-2x')} />
              {/* <span style={{ 'margin-left': '.3em' }}>GitHub</span> */}
            </Button>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

NavBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NavBar);
