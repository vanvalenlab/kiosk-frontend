import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  footer: {
    flex: 'none',
    marginTop: theme.spacing(6),
    padding: `${theme.spacing(2)}px ${theme.spacing(2)}px`,
    backgroundColor: theme.palette.background.paper
  }
});

class Footer extends React.Component {

  render() {
    const fullDate = new Date();
    const currYear = fullDate.getFullYear();
    const { classes } = this.props;
    return (
      <footer className={classes.footer}>
        <Typography variant='subtitle1' align='center' color='textSecondary' component='p'>
          © 2016-{currYear} The Van Valen Lab at the California Institute of Technology
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
