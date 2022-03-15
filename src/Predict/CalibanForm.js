import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
// import axios from 'axios';
import ResolutionDropdown from './ResolutionDropdown';
import jobData from './jobData';

CalibanForm.propTypes = {
  selectJobType: PropTypes.element.isRequired,
  setJobForm: PropTypes.func.isRequired,
};

export default function CalibanForm({ selectJobType, setJobForm }) {
  const modelResolution = jobData.segmentation.modelResolution;
  const [scale, setScale] = useState(1);

  useEffect(() => {
    setJobForm({ scale });
  }, [scale]);

  return (
    <Grid container>
      <Paper sx={{ p: 4, height: '100%', width: '100%' }}>
        <Grid container spacing={1}>
          <Grid item md={6}>
            <Grid container direction={'column'} spacing={1}>
              {selectJobType}
              <Grid item lg>
                <Typography>Image Resolution</Typography>
                <ResolutionDropdown
                  modelMpp={modelResolution}
                  scale={scale}
                  onChange={setScale}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
}
