import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  heroContent: {
    maxWidth: 600,
    margin: '0 auto',
    padding: `${theme.spacing.unit * 8}px 0 ${theme.spacing.unit * 6}px`,
  },
  buttonHolder: {
    justifyContent: 'center'
  },
  right: {
    float: 'right'
  },
  left: {
    float: 'left'
  }
});

class Landing extends React.Component {
  render() {
    const { classes } = this.props;

    return(
      <div>
        <div className={classes.heroContent}>
          <Typography variant="display4" align="center" color="textPrimary" gutterBottom>
            DeepCell
          </Typography>
          <Typography variant="title" align="center" color="textSecondary" paragraph>
            Use an existing model to segment images or train a new model.
          </Typography>
        </div>
        <div className={classes.buttonHolder}>
          <Grid container spacing={40}>
            <Grid item xs={6}>
              <Button
                size="large"
                variant="contained"
                color="secondary"
                className={classNames(classes.button, classes.right)}
                href="/predict">
                Predict
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                size="large"
                variant="contained"
                color="primary"
                className={classNames(classes.button, classes.left)}
                href="/train">
                Train
              </Button>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

Landing.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Landing);
