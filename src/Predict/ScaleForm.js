import React from 'react';
import { PropTypes } from 'prop-types';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import TextField from '@mui/material/TextField';

export default function ScaleForm({
  checked = true,
  scale = 1,
  onCheckboxChange = () => {},
  onScaleChange = () => {},
}) {
  return (
    <FormGroup row>
      <FormControl>
        <FormControlLabel
          control={
            <Checkbox
              checked={checked}
              onChange={onCheckboxChange}
              value={checked}
            />
          }
          label='Rescale Automatically'
        />

        <TextField
          id='outlined-number'
          label='Rescaling Value'
          disabled={checked}
          value={scale}
          onChange={onScaleChange}
          type='number'
          margin='dense'
          variant='standard'
        />
      </FormControl>
    </FormGroup>
  );
}

ScaleForm.propTypes = {
  scale: PropTypes.number,
  checked: PropTypes.bool,
  onCheckboxChange: PropTypes.func,
  onScaleChange: PropTypes.func,
};
