import { Button, Grid } from '@mui/material';

function SubmitButton({ onClick, disabled }) {
  return (
    <Grid id='submitButtonWrapper' item lg sx={{ pt: 4 }}>
      <Button
        id='submitButton'
        variant='contained'
        onClick={onClick}
        size='large'
        fullWidth
        disabled={disabled}
        color='primary'
      >
        Submit
      </Button>
    </Grid>
  );
}

SubmitButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default SubmitButton;
