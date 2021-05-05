import React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    margin: theme.spacing(4)
  },
  heroContent: {
    maxWidth: 600,
    margin: '0 auto',
    padding: `${theme.spacing(8)}px 0 ${theme.spacing(6)}px`,
  },
  button: {
    minWidth: '20vh',
  }
}));

export default function Landing() {

  const classes = useStyles();

  return(
    <div className={classes.root}>
      <div className={classes.heroContent}>
        <Typography variant="h1" align="center" color="textPrimary" gutterBottom>
          DeepCell
        </Typography>
        <Typography variant="h5" align="center" color="textSecondary" paragraph>
          Use a deep learning model to segment images.
        </Typography>
      </div>
      <Grid container justify="center" spacing={5}>
        <Grid item>
          <Button
            fullWidth
            size="large"
            variant="contained"
            color="primary"
            className={classes.button}
            href="https://datasets.deepcell.org"
            target="_blank"
            rel="noopener noreferrer">
            Data
          </Button>
        </Grid>
        <Grid item>
          <Button
            fullWidth
            size="large"
            variant="contained"
            color="secondary"
            className={classes.button}
            href="/predict">
            Predict
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}
