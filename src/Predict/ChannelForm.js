import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import makeStyles from '@mui/styles/makeStyles';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const useStyles = makeStyles(theme => ({
  leftPad: {
    paddingLeft: theme.spacing(1),
  },
  floatLeft: {
    float: 'left',
  },
  capitalize: {
    textTransform: 'capitalize',
  }
}));

function ChannelDropdown(props) {

  const { label, value, channels, onChange } = props;
  const [isOpen, setIsOpen] = useState(false);

  const classes = useStyles();

  return (
    <FormControl fullWidth>
      <InputLabel margin='dense' htmlFor={`${label}-input`}>{`${label} channel`}</InputLabel>
      <Select
        labelId={`${label}-input`}
        open={isOpen}
        onClose={() => setIsOpen(false)}
        onOpen={() => setIsOpen(true)}
        onChange={onChange}
        value={value}
        autoWidth={true}
        className={(classes.leftPad, classes.capitalize)}
      >
        {channels.map((c, i) => (
          <MenuItem value={c} key={i} className={classes.capitalize}>
            Channel {i+1} ({c})
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

ChannelDropdown.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  channels: PropTypes.array,
  onChange: PropTypes.func,
};


export default function ChannelForm(props) {

  const { targetChannels, channels, onChange } = props;

  return (
    <FormGroup>
      <Grid container spacing={1} xs={12}>
        {targetChannels && Object.keys(targetChannels).map((t, i) => (
          <Grid item key={i}>
            <ChannelDropdown
              label={`${t}`}
              value={targetChannels[t]}
              channels={channels}
              onChange={e => onChange(e.target.value, t)}
            />
          </Grid>
        ))}
      </Grid>
    </FormGroup>
  );
}

ChannelForm.propTypes = {
  channels: PropTypes.array,
  targetChannels: PropTypes.object,
  onChange: PropTypes.func,
};
