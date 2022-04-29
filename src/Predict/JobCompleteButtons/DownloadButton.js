import { Button, Grid } from '@mui/material';
import React from 'react';
import PropTypes from 'prop-types';
function DownloadButton({ labelsUrl }) {
  return (
    <Grid item lg sx={{ pt: 4 }}>
      <Button
        href={labelsUrl}
        variant='contained'
        size='large'
        fullWidth
        color='secondary'
      >
        Download Results
      </Button>
    </Grid>
  );
}

DownloadButton.propTypes = {
  labelsUrl: PropTypes.string.isRequired,
};

export default DownloadButton;
