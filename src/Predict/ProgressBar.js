import { Grid, LinearProgress, Typography } from '@mui/material';

function ProgressBar({ progress, status }) {
  return (
    <Grid item lg sx={{ pt: 4 }}>
      {progress === 0 || progress === null ? (
        <LinearProgress
          variant='buffer'
          value={0}
          valueBuffer={0}
          sx={{ m: 2 }}
        />
      ) : (
        <LinearProgress variant='determinate' value={progress} sx={{ m: 2 }} />
      )}
      {/* Display status updates to user */}
      {status.length > 0 && (
        <Typography
          sx={{ pt: 4, textTransform: 'capitalize' }}
          variant='body1'
          align='center'
          color='primary'
        >
          Job Status: {status}
        </Typography>
      )}
    </Grid>
  );
}

ProgressBar.propTypes = {
  progress: PropTypes.number.isRequired,
  status: PropTypes.string.isRequired,
};

export default ProgressBar;
