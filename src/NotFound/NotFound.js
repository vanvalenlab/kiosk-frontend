import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  root: {
    paddingTop: '20%',
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
});

export default function NotFound() {
  const classes = useStyles();
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
