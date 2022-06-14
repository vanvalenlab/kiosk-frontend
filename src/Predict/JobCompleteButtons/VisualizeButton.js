import { Button, Grid } from '@mui/material';
import axios from 'axios';
import React from 'react';
import PropTypes from 'prop-types';

function VisualizeButton({ url, imagesUrl, dimensionOrder, labelsUrl }) {
  const openVisualizer = () => {
    var formData = new FormData();
    formData.append('images', imagesUrl);
    formData.append('labels', labelsUrl);
    formData.append('axes', dimensionOrder);

    const newTab = window.open(`${url}/loading`, '_blank');
    axios({
      method: 'post',
      url: `${url}/api/project`,
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then((res) => {
        newTab.location.href = `${url}/project?projectId=${res.data}`;
      })
      .catch((err) => {
        console.log(err);
        newTab.location.href = `${url}/loading?error=${err.message}`;
      });
  };

  return (
    <Grid item lg sx={{ pt: 4 }}>
      <Button
        variant='contained'
        size='large'
        fullWidth
        onClick={openVisualizer}
      >
        View Results
      </Button>
    </Grid>
  );
}

VisualizeButton.propTypes = {
  url: PropTypes.string.isRequired,
  imagesUrl: PropTypes.string.isRequired,
  labelsUrl: PropTypes.string.isRequired,
  dimensionOrder: PropTypes.string.isRequired,
};

export default VisualizeButton;
