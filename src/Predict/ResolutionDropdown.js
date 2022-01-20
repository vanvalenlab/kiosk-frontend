import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

export default function ResolutionDropdown({
  modelMpp = 0.5,
  scale = 1,
  onChange = () => {},
}) {

  const [isOpen, setIsOpen] = useState(false);

  // values determined from 
  // https://openwetware.org/wiki/Methods_to_determine_the_size_of_an_object_in_microns
  // using 0.5 ~= 20x as the starting point
  const zoomToMpp = {
    '10x': 1,
    '20x': 0.5,
    '40x': 0.25,
    '60x': 0.1667,
    '100x': 0.1,
  };

  return (
    <FormGroup row>
      <FormControl>
        <Select
          labelId="input-resolution-select-label"
          id="input-resolution-select"
          value={scale}
          open={isOpen}
          onClose={() => setIsOpen(false)}
          onOpen={() => setIsOpen(true)}
          onChange={e => onChange(e.target.value)}
        >
          {Object.entries(zoomToMpp).map(([zoom, mpp], i) => {
            return (
              <MenuItem value={mpp / modelMpp} key={i}>
                {zoom} ({mpp} μm/pixel)
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </FormGroup>
  );
}

ResolutionDropdown.propTypes = {
  scale: PropTypes.number,
  modelMpp: PropTypes.number,
  onChange: PropTypes.func,
};
