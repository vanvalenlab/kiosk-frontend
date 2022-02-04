import React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/system';

const MuiFooter = styled('footer')``;

export default function Footer() {
  const fullDate = new Date();
  const currYear = fullDate.getFullYear();

  return (
    <MuiFooter sx={{ flex: 'none', mt: 6, p: 2, backgroundColor: 'background.paper' }}>
      <Typography variant='subtitle2' align='center' color='textSecondary' component='p'>
        © 2016-{currYear} The Van Valen Lab at the California Institute of Technology
        (Caltech). All rights reserved.
      </Typography>
      <Typography variant='subtitle2' align='center' color='textSecondary' component='p'>
        Please post any questions on our <Link href="https://github.com/vanvalenlab/intro-to-deepcell/issues">GitHub page</Link>,
        and for any collaborations request please reach out to <Link href="mailto:info@deepcell.org">info@deepcell.org</Link>.
      </Typography>
    </MuiFooter>
  );
}
