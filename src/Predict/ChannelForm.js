import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

function ChannelDropdown(props) {
  const { label, value, onChange, required } = props;
  const [isOpen, setIsOpen] = useState(false);
  const channels = ['red', 'green', 'blue'];

  return (
    <FormControl variant='standard' fullWidth>
      <InputLabel
        shrink
        margin='dense'
        htmlFor={`${label}-input`}
      >{`${label} channel`}</InputLabel>
      <Select
        size='small'
        labelId={`${label}-input`}
        open={isOpen}
        onClose={() => setIsOpen(false)}
        onOpen={() => setIsOpen(true)}
        onChange={onChange}
        value={value}
        // autoWidth={true}
        displayEmpty
        sx={{ textTransform: 'capitalize' }}
      >
        {!required && <MenuItem value={null}>None</MenuItem>}
        {channels.map((c, i) => (
          <MenuItem value={i} key={c} sx={{ textTransform: 'capitalize' }}>
            Channel {i + 1} ({c})
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

ChannelDropdown.propTypes = {
  label: PropTypes.string,
  value: PropTypes.number,
  channels: PropTypes.array,
  onChange: PropTypes.func,
  required: PropTypes.bool,
};

export default function ChannelForm(props) {
  const { channels, selectedChannels, requiredChannels, onChange } = props;
  return (
    <FormGroup>
      <Grid container spacing={1} xs={12} direction='column'>
        {selectedChannels &&
          selectedChannels.map((channel, i) => (
            <Grid item key={channels[i]}>
              <ChannelDropdown
                label={`${channels[i]}`}
                value={channel}
                index={i}
                onChange={(e) => onChange(e.target.value, i)}
                required={requiredChannels[i]}
              />
            </Grid>
          ))}
      </Grid>
    </FormGroup>
  );
}

ChannelForm.propTypes = {
  channels: PropTypes.array,
  requiredChannels: PropTypes.array,
  selectedChannels: PropTypes.array,
  onChange: PropTypes.func,
};
