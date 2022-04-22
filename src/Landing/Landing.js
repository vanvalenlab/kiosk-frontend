import React from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/system';

const Div = styled('div')``;

export default function Landing() {
  return (
    <Div sx={{ flexGrow: 1, m: 4 }}>
      <Div
        sx={{
          maxWidth: 600,
          m: '0 auto',
          p: (theme) => `${theme.spacing(8)} 0 ${theme.spacing(6)}`,
        }}
      >
        <Typography
          variant='h1'
          align='center'
          color='textPrimary'
          gutterBottom
        >
          DeepCell
        </Typography>
        <Typography variant='h5' align='center' color='textSecondary' paragraph>
          Use a deep learning model to segment images.
        </Typography>
      </Div>
      <Grid container justifyContent='center' spacing={5}>
        <Grid item>
          <Button
            fullWidth
            size='large'
            variant='contained'
            color='primary'
            sx={{ minWidth: '20vh' }}
            href='https://datasets.deepcell.org'
            target='_blank'
            rel='noopener noreferrer'
          >
            Data
          </Button>
        </Grid>
        <Grid item>
          <Button
            fullWidth
            size='large'
            variant='contained'
            color='secondary'
            sx={{ minWidth: '20vh' }}
            href='/predict'
          >
            Predict
          </Button>
        </Grid>
      </Grid>
    </Div>
  );
}
