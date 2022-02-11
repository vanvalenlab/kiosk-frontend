import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

function ChannelDropdown(props) {
  const { label, value, onChange } = props;
  const [isOpen, setIsOpen] = useState(false);
  const channels = ['red', 'green', 'blue'];

  return (
    <FormControl variant='standard' fullWidth>
      <InputLabel margin='dense' htmlFor={`${label}-input`}>{`${label} channel`}</InputLabel>
      <Select
        size='small'
        labelId={`${label}-input`}
        open={isOpen}
        onClose={() => setIsOpen(false)}
        onOpen={() => setIsOpen(true)}
        onChange={onChange}
        value={value}
        autoWidth={true}
        sx={{ textTransform: 'capitalize' }}
      >
        {channels.map((c, i) => (
          <MenuItem value={i} key={c} sx={{ textTransform: 'capitalize' }}>
            Channel {i+1} ({c})
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
};


export default function ChannelForm(props) {

  const { selectedChannels, requiredChannels, onChange } = props;
  return (
    <FormGroup>
      <Grid container spacing={1} xs={12}>
        {selectedChannels && selectedChannels.map((channel, i) => (
          <Grid item key={i}>
            <ChannelDropdown
              label={`${requiredChannels[i]}`}
              value={channel}
              index={i}
              onChange={e => onChange(e.target.value, i)}
            />
          </Grid>
        ))}
      </Grid>
    </FormGroup>
  );
}

ChannelForm.propTypes = {
  requiredChannels: PropTypes.array,
  selectedChannels: PropTypes.array,
  onChange: PropTypes.func,
};
