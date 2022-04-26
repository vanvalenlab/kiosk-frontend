import { Button, Grid } from '@mui/material';
import React from 'react';

function SubmitNewButton() {
  return (
    <Grid item lg sx={{ pt: 4 }}>
      <Button
        href='/predict'
        variant='contained'
        size='large'
        fullWidth
        color='primary'
      >
        Submit New Image
      </Button>
    </Grid>
  );
}

export default SubmitNewButton;
