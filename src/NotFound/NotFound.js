import React from 'react';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/system';

const Div = styled('div')``;

export default function NotFound() {
  return (
    <Div sx={{ pt: '20%', flexGrow: 1 }}>
      <Typography variant='h2' color='inherit' sx={{ flexGrow: 1 }} gutterBottom align='center'>
        404 page not found
      </Typography>

      <Typography variant='h5' color='inherit' sx={{ flexGrow: 1 }} gutterBottom align='center'>
        We are sorry but the page you are looking for does not exist.
      </Typography>
    </Div>
  );
}
