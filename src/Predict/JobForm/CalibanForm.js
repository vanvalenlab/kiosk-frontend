import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

CalibanForm.propTypes = {
  jobDropdown: PropTypes.element.isRequired,
};

export default function CalibanForm({ jobDropdown }) {
  return (
    <Grid container>
      <Paper sx={{ p: 4, height: '100%', width: '100%' }}>
        <Grid container spacing={1}>
          <Grid item md={6}>
            <Grid container direction={'column'} spacing={1}>
              {jobDropdown}
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
}
