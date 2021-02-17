import React from 'react';
import { PropTypes } from 'prop-types';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import TextField from '@material-ui/core/TextField';

export default function ScaleForm(props) {

  const { checked, scale, onCheckboxChange, onScaleChange } = props;

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
          label="Rescale Automatically"
        />

        <TextField
          id="outlined-number"
          label="Rescaling Value"
          disabled={checked}
          value={scale}
          onChange={onScaleChange}
          type="number"
          margin="dense"
          variant="standard"
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
