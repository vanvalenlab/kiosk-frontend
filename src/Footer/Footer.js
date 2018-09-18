import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  footer: {
    backgroundColor: theme.palette.background.paper,
    marginTop: theme.spacing.unit * 8,
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 2}px`
  }
});

class Footer extends React.Component {

  render() {
    const { classes } = this.props;
    return (
      <footer className={classes.footer}>
        <Typography variant="subheading" align="center" color="textSecondary" component="p">
          © 2016-2018 David Van Valen at California Institute of Technology
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
