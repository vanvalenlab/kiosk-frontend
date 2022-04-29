import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
// import axios from 'axios';
import ResolutionDropdown from './ResolutionDropdown';
import ChannelForm from './ChannelForm';
import jobData from '../jobData';

MesmerForm.propTypes = {
  jobDropdown: PropTypes.element.isRequired,
  setJobForm: PropTypes.func.isRequired,
};

export default function MesmerForm({ jobDropdown, setJobForm }) {
  const modelResolution = jobData.mesmer.modelResolution;
  const channels = jobData.mesmer.requiredChannels;
  const [requiredChannels] = useState(Array(channels.length).fill(true));
  const [selectedChannels, setSelectedChannels] = useState([
    ...Array(channels.length).keys(),
  ]);
  const [scale, setScale] = useState(1);

  const updateSelectedChannels = (value, i) => {
    setSelectedChannels((selectedChannels) => {
      selectedChannels[i] = value;
      return [...selectedChannels];
    });
  };

  useEffect(() => {
    setJobForm({ scale, selectedChannels: selectedChannels.join(',') });
  }, [selectedChannels, scale]);

  return (
    <Grid container>
      <Paper sx={{ p: 4, height: '100%', width: '100%' }}>
        <Grid container spacing={1}>
          <Grid item md={6}>
            <Grid container direction={'column'} spacing={1}>
              {jobDropdown}
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
          <Grid item md={6}>
            <ChannelForm
              channels={channels}
              requiredChannels={requiredChannels}
              selectedChannels={selectedChannels}
              onChange={updateSelectedChannels}
            />
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
}
