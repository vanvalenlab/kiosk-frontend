import { Button, Grid } from '@mui/material';
import React from 'react';
import PropTypes from 'prop-types';
function DownloadButton({ downloadUrl }) {
  return (
    <Grid item lg sx={{ pt: 4 }}>
      <Button
        href={downloadUrl}
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
  downloadUrl: PropTypes.string.isRequired,
};

export default DownloadButton;
