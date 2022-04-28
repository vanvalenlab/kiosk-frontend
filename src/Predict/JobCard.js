import React from 'react';
import { PropTypes } from 'prop-types';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

export default function JobCard({
  file = 'dummyfile.png',
  name = 'Model',
  model = 'The Model takes in single-channeled images.',
  inputs = 'An image file.',
  thumbnail = 'https://bit.ly/2ZxBrQ1',
}) {
  const baseUrl = 'https://s3-us-west-1.amazonaws.com/deepcell-data';
  const moreInfoUrl =
    'https://github.com/vanvalenlab/intro-to-deepcell/tree/master/pretrained_models';

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        sx={{ paddingTop: '56.25%' }} // 16:9
        image={`${baseUrl}/${thumbnail}`}
        title={`${name}`}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant='h5'>
          {name}
        </Typography>
        <Typography gutterBottom variant='subtitle1'>
          <strong>Model:</strong> {model}
        </Typography>
        <Typography variant='subtitle1'>
          <strong>Inputs:</strong> {inputs}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size='small'
          color='primary'
          target='_blank'
          href={`${baseUrl}/${file}`}
        >
          Download Image
        </Button>
        <Button size='small' color='primary' target='_blank' href={moreInfoUrl}>
          Learn More
        </Button>
      </CardActions>
    </Card>
  );
}

JobCard.propTypes = {
  file: PropTypes.string,
  name: PropTypes.string,
  model: PropTypes.string,
  inputs: PropTypes.string,
  resolution: PropTypes.string,
  thumbnail: PropTypes.string,
};
