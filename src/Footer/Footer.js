import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  footer: {
    flex: 'none',
    marginTop: theme.spacing.unit * 8,
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 2}px`,
    backgroundColor: theme.palette.background.paper
  }
});

class Footer extends React.Component {

  render() {
    var full_date = new Date();
    var curr_yr = full_date.getFullYear();
    const { classes } = this.props;
    return (
      <footer className={classes.footer}>
        <Typography variant='subheading' align='center' color='textSecondary' component='p'>
          © 2016-{curr_yr} The Van Valen Lab at the California Institute of Technology testing2
          (Caltech). All rights reserved.
        </Typography>
      </footer>
    );
  }
}

Footer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Footer);
