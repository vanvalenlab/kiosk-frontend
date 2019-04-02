import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { loadCSS } from 'fg-loadcss/src/loadCSS';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Menu from '@material-ui/core/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MoreIcon from '@material-ui/icons/MoreVert';

const styles = theme => ({
  root: {
  },
  grow: {
    flexGrow: 1,
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  mobileMenuItem: {
    display: 'block'
  }
});

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      mobileMoreAnchorEl: null,
    };

    this.handleProfileMenuOpen = this.handleProfileMenuOpen.bind(this);
    this.handleMenuClose = this.handleMenuClose.bind(this);
    this.handleMobileMenuOpen = this.handleMobileMenuOpen.bind(this);
    this.handleMobileMenuClose = this.handleMobileMenuClose.bind(this);
  }

  componentDidMount() {
    loadCSS(
      'https://use.fontawesome.com/releases/v5.1.0/css/all.css',
      document.querySelector('#insertion-point-css'),
    );
  }

  handleProfileMenuOpen(event) {
    this.setState({ anchorEl: event.currentTarget });
  }

  handleMenuClose() {
    this.setState({ anchorEl: null });
    this.handleMobileMenuClose();
  }

  handleMobileMenuOpen(event) {
    this.setState({ mobileMoreAnchorEl: event.currentTarget });
  }

  handleMobileMenuClose() {
    this.setState({ mobileMoreAnchorEl: null });
  }

  render() {
    const { mobileMoreAnchorEl } = this.state;
    const { classes } = this.props;
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const renderMobileMenu = (
      <Menu
        anchorEl={mobileMoreAnchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMobileMenuOpen}
        onClose={this.handleMobileMenuClose}
      >
        <Button color='inherit' href='/train' className={classes.mobileMenuItem}>
          Train
        </Button>
        <Button color='inherit' href='/predict' className={classes.mobileMenuItem}>
          Predict
        </Button>
        <Button color='inherit' href='/track' className={classes.mobileMenuItem}>
          Track
        </Button>
        <Button color='inherit' href='/data' className={classes.mobileMenuItem}>
          Data
        </Button>
        <Button color='inherit' href='/' className={classes.mobileMenuItem}>
          Jupyter
        </Button>
        <Button color='inherit' href='https://github.com/vanvalenlab' target='_blank' className={classes.mobileMenuItem}>
          <Icon className={classNames(classes.icon, 'fab fa-github fa-2x')} />
        </Button>
      </Menu>
    );

    return (
      <div className={classes.root}>
        <AppBar position='static'>
          <Toolbar>
            <Typography variant='title' color='inherit' className={classes.grow}>
              <IconButton color='inherit' href='/'>
                DeepCell
              </IconButton>
            </Typography>
            <div className={classes.grow} />
            <div className={classes.sectionDesktop}>
              <Button color='inherit' href='/train'>
                Train
              </Button>
              <Button color='inherit' href='/predict'>
                Predict
              </Button>
              <Button color='inherit' href='/track'>
                Track
              </Button>
              <Button color='inherit' href='/data'>
                Data
              </Button>
              <Button color='inherit' href='/'>
                Jupyter
              </Button>
              <Button color='inherit' href='https://github.com/vanvalenlab' target='_blank'>
                <Icon className={classNames(classes.icon, 'fab fa-github fa-2x')} />
              </Button>
            </div>
            <div className={classes.sectionMobile}>
              <IconButton aria-haspopup='true' onClick={this.handleMobileMenuOpen} color='inherit'>
                <MoreIcon />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
      </div>
    );
  }
}

NavBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NavBar);
