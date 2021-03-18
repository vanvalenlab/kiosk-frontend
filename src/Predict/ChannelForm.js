import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

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
        className={classes.leftPad, classes.capitalize}
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
      {targetChannels && Object.keys(targetChannels).map((t, i) => (
        <ChannelDropdown
          label={`${t}`}
          key={i}
          value={targetChannels[t]}
          channels={channels}
          onChange={e => onChange(e.target.value, t)}
        />
      ))}
    </FormGroup>
  );
}

ChannelForm.propTypes = {
  channels: PropTypes.array,
  targetChannels: PropTypes.object,
  onChange: PropTypes.func,
};
