import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
// import axios from 'axios';
import ChannelForm from './ChannelForm';
// import jobData from './jobData';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

SelectSegmentation.propTypes = {
  value: PropTypes.string,
  options: PropTypes.array,
  onChange: PropTypes.func,
};

function SelectSegmentation({
  value = 'none',
  options = ['none', 'tissue', 'cell culture'],
  onChange = () => {},
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <FormGroup row>
      <FormControl>
        <Select
          size='small'
          labelId='input-resolution-select-label'
          id='input-resolution-select'
          value={value}
          open={isOpen}
          onClose={() => setIsOpen(false)}
          onOpen={() => setIsOpen(true)}
          onChange={(e) => onChange(e.target.value)}
          variant='standard'
          sx={{ textTransform: 'capitalize' }}
        >
          {options.map((opt) => (
            <MenuItem
              value={opt}
              key={opt}
              sx={{ textTransform: 'capitalize' }}
            >
              {opt}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </FormGroup>
  );
}

PolarisForm.propTypes = {
  jobDropdown: PropTypes.element.isRequired,
  setJobForm: PropTypes.func.isRequired,
};

export default function PolarisForm({ jobDropdown, setJobForm }) {
  const [channels, setChannels] = useState([]);
  const [requiredChannels, setRequiredChannels] = useState([]);
  const [selectedChannels, setSelectedChannels] = useState([]);
  const [segmentationType, setSegmentationType] = useState('cell culture');
  const segmentationOptions = ['none', 'tissue', 'cell culture'];

  useEffect(() => {
    if (segmentationType === 'none') {
      setChannels([]);
      setRequiredChannels([]);
      setSelectedChannels([]);
    } else if (segmentationType === 'tissue') {
      setChannels(['spots', 'nuclei', 'cytoplasm']);
      setRequiredChannels([true, true, true]);
      setSelectedChannels([0, 1, 2]);
    } else if (segmentationType === 'cell culture') {
      setChannels(['spots', 'nuclei', 'cytoplasm']);
      setRequiredChannels([true, false, false]);
      setSelectedChannels([0, 1, 2]);
    } else {
      setChannels([]);
      setRequiredChannels([]);
      setSelectedChannels([]);
    }
  }, [segmentationType]);

  useEffect(() => {
    setJobForm({
      selectedChannels: selectedChannels.join(','),
      segmentationType,
    });
  }, [segmentationType, selectedChannels]);

  const updateSelectedChannels = (value, i) => {
    setSelectedChannels((selectedChannels) => {
      selectedChannels[i] = value;
      return [...selectedChannels];
    });
  };

  return (
    <Grid container>
      <Paper sx={{ p: 4, height: '100%', width: '100%' }}>
        <Grid container spacing={1}>
          <Grid item md={6}>
            <Grid container direction={'column'} spacing={1}>
              {jobDropdown}
              <Grid item lg>
                <Typography>Segmentation Type</Typography>
                <SelectSegmentation
                  value={segmentationType}
                  options={segmentationOptions}
                  onChange={setSegmentationType}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={6}>
            <ChannelForm
              channels={channels}
              selectedChannels={selectedChannels}
              requiredChannels={requiredChannels}
              onChange={updateSelectedChannels}
            />
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
}
