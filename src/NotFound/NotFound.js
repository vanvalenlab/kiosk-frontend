import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

const styles = {
  root: {
    paddingTop: '20%',
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
};

class NotFound extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Typography variant='h2' color='inherit' className={classes.grow} gutterBottom align='center'>
          404 page not found
        </Typography>

        <Typography variant='h5' color='inherit' className={classes.grow} gutterBottom align='center'>
          We are sorry but the page you are looking for does not exist.
        </Typography>
      </div>
    );
  }
}

NotFound.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NotFound);
