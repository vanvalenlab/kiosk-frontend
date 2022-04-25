import { Link, Typography } from '@mui/material';

function Error({ errorText }) {
  return (
    <div>
      <Typography
        sx={{ pt: 4, whiteSpace: 'pre-line' }}
        variant='body2'
        align='center'
        color='error'
      >
        {errorText}
      </Typography>
      <Typography
        sx={{ pt: 4 }}
        variant='subtitle2'
        align='center'
        color='error'
      >
        See the{' '}
        <Link href='/faq' target='_blank' rel='noopener noreferrer'>
          FAQ
        </Link>{' '}
        for information on common errors.
      </Typography>
    </div>
  );
}

export default Error;
