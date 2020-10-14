import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    flexGrow: 1,
    margin: theme.spacing(4)
  }
});

class About extends React.Component {

  render() {
    const { classes } = this.props;

    return(
      <div className={classes.root}>
        <div className={classes.heroContent}>
          <Typography variant="h1" align="center" color="textPrimary" gutterBottom>
            About DeepCell
          </Typography>
        </div>
      </div>
    );
  }
}

About.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(About);
