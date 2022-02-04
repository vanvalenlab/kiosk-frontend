import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

export default function SegmentationTypeDropdown(props){

  const { value, onChange } = props;

  const [isOpen, setIsOpen] = useState(false);

  return (
    <FormGroup row>
      <FormControl>
        <Select
          labelId="input-segmentation-type-select-label"
          id="input-segmentation-type-select"
          value={value}
          open={isOpen}
          onClose={() => setIsOpen(false)}
          onOpen={() => setIsOpen(true)}
          onChange={e => onChange(e.target.value)}
        >
          <MenuItem value={'cytoplasm'}>Whole Cell</MenuItem>
          <MenuItem value={'mesmer'}>Mesmer</MenuItem>
          <MenuItem value={'no segmentation'}>No Segmentation</MenuItem>
        </Select>
      </FormControl>
    </FormGroup>
  );
}

SegmentationTypeDropdown.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
};