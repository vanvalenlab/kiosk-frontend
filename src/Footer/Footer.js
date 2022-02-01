import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

const useStyles = makeStyles(theme => ({
  footer: {
    flex: 'none',
    marginTop: theme.spacing(6),
    padding: `${theme.spacing(2)} ${theme.spacing(2)}`,
    backgroundColor: theme.palette.background.paper
  }
}));

export default function Footer() {
  const fullDate = new Date();
  const currYear = fullDate.getFullYear();
  const classes = useStyles();
  return (
    <footer className={classes.footer}>
      <Typography variant='subtitle2' align='center' color='textSecondary' component='p'>
        © 2016-{currYear} The Van Valen Lab at the California Institute of Technology
        (Caltech). All rights reserved.
      </Typography>
      <Typography variant='subtitle2' align='center' color='textSecondary' component='p'>
        Please post any questions on our <Link href="https://github.com/vanvalenlab/intro-to-deepcell/issues">GitHub page</Link>,
        and for any collaborations request please reach out to <Link href="mailto:info@deepcell.org">info@deepcell.org</Link>.
      </Typography>
    </footer>
  );
}
