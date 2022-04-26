import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
// import axios from 'axios';
import ResolutionDropdown from './ResolutionDropdown';
import ChannelForm from './ChannelForm';
import jobData from '../jobData';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

function DimensionOrderDropdown(props) {
  const { value, onChange } = props;
  const orders = ['bxy', 'cxy', 'bxyc', 'cxyb'];

  return (
    <FormControl variant='standard' fullWidth>
      <Select
        size='small'
        onChange={(e) => onChange(e.target.value)}
        value={value}
      >
        {orders.map((o, i) => (
          <MenuItem value={o} key={i}>{o}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

DimensionOrderDropdown.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func
};

SegmentationForm.propTypes = {
  jobDropdown: PropTypes.element.isRequired,
  setJobForm: PropTypes.func.isRequired,
};

export default function SegmentationForm({ jobDropdown, setJobForm }) {
  const modelResolution = jobData.segmentation.modelResolution;
  const channels = ['nuclei', 'cytoplasm'];
  const [requiredChannels] = useState(Array(channels.length).fill(false));
  const [selectedChannels, setSelectedChannels] = useState([
    ...Array(channels.length).keys(),
  ]);
  const [dimensionOrder, setDimensionOrder] = useState('bxy');
  const [scale, setScale] = useState(1);

  const updateSelectedChannels = (value, i) => {
    setSelectedChannels((selectedChannels) => {
      selectedChannels[i] = value;
      return [...selectedChannels];
    });
  };

  useEffect(() => {
    setJobForm({ scale, selectedChannels: selectedChannels.join(','), dimensionOrder });
  }, [selectedChannels, scale, dimensionOrder]);

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
            <Grid container direction={'column'} spacing={1}>
              <Grid item lg>
                <Typography>Dimension Order</Typography>
                <DimensionOrderDropdown
                  value={dimensionOrder}
                  onChange={setDimensionOrder}
                />
              </Grid>
              <Grid item lg>
                <ChannelForm
                  channels={channels}
                  requiredChannels={requiredChannels}
                  selectedChannels={selectedChannels}
                  onChange={updateSelectedChannels}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
}
