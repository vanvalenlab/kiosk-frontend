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

    // TODO: make mesmer and spots visualizers behave consistently
    // spots: need to add /project
    // mesmer: must be only base URL
    const viewerUrl = url.includes('spots') ? `${url}/project` : url;
    const newTab = window.open(viewerUrl, '_blank');
    axios({
      method: 'post',
      url: `${url}/api/project`,
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((res) => {
      // TODO: make mesmer and spots API return the same response
      // memser: { projectId: "EXAMPLEID" }
      // spots: "EXAMPLEID"
      const projectId = res.data.projectId ?? res.data;
      const projectUrl = `${viewerUrl}?projectId=${projectId}`;
      newTab.location.href = projectUrl;
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
