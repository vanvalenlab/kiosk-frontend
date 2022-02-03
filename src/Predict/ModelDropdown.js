import React, { useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';

export default function ModelDropdown(props) {

  const { value, onChange, onError } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [allJobTypes, setAllJobTypes] = useState([]);

  const getAllJobTypes = () => {
    axios({
      method: 'get',
      url: '/api/jobtypes'
    }).then((response) => {
      setAllJobTypes(response.data.jobTypes);
      onChange(response.data.jobTypes[0]);
    }).catch(error => {
      onError(`Failed to get job types due to error: ${error}`);
    });
  };

  useEffect(() => getAllJobTypes(), [0]);

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
        {allJobTypes.map((job, i) => (
          <MenuItem value={job} style={{textTransform: 'capitalize'}} key={i}>
            {job}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

ModelDropdown.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  onError: PropTypes.func,
};
