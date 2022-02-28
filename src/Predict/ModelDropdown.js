import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

export default function ModelDropdown(props) {

  const { value, onChange, options } = props;

  const [isOpen, setIsOpen] = useState(false);

  return (
    <FormControl>
      <Select
        size='small'
        open={isOpen}
        onClose={() => setIsOpen(false)}
        onOpen={() => setIsOpen(true)}
        onChange={e => onChange(e.target.value)}
        value={value}
        sx={{ textTransform: 'capitalize' }}
        variant="standard"
      >
        {options.map((jobType, i) => (
          <MenuItem value={jobType} sx={{ textTransform: 'capitalize' }} key={i}>
            {jobType}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

ModelDropdown.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  options: PropTypes.array,
};
