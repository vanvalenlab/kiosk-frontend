import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  footer: {
    backgroundColor: theme.palette.background.paper,
    height: '60px',
    width: '100%',
    position:'absolute',
    left:0,
    bottom:0,
    right:0,
    paddingTop: '20px',
  },
  phantom: {
    display: 'block',
    padding: '1px',
    width: '100%',
  }
});

class Footer extends React.Component {

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.footer}>
        <div className={classes.phantom} />
        <Typography variant='subheading' align='center' color='textSecondary' component='p'>
          © 2016-2018 The Van Valen Lab at the California Institute of Technology
          (Caltech). All rights reserved.
        </Typography>
      </div>
    );
  }
}

Footer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Footer);
