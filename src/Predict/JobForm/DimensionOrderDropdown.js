import React from 'react';
import PropTypes from 'prop-types';
// import axios from 'axios';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { InputLabel, Tooltip, Box, Typography } from '@mui/material';
import { HelpOutline } from '@mui/icons-material';

function DimensionOrderDropdown(props) {
  const { value, onChange } = props;
  const orders = ['XY', 'BXY', 'CXY', 'BXYC', 'CXYB'];

  return (
    <FormControl variant='standard' fullWidth>
      <InputLabel shrink margin='dense' htmlFor='dimension-order-input'>
        <Box display='flex' alignItems='center' justifyContent='center'>
          <Typography>dimension order</Typography>
          <Tooltip
            title={
              'Set the order of the batch (B) and channel (C) dimensions. ' +
              'Each channel and batch will be segmented and predicted separately.'
            }
          >
            <HelpOutline fontSize='small' />
          </Tooltip>
        </Box>
      </InputLabel>
      <Select
        size='small'
        onChange={(e) => onChange(e.target.value)}
        value={value}
      >
        {orders.map((o, i) => (
          <MenuItem value={o} key={i}>
            {o}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

DimensionOrderDropdown.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export default DimensionOrderDropdown;
