import React from 'react';
import { PropTypes } from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(() => ({
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  }
}));

export default function JobCard({
  file = 'dummyfile.png',
  name = 'Model',
  description = 'The Model takes in single-channeled images.',
  thumbnail = 'https://bit.ly/2ZxBrQ1',
}) {

  const classes = useStyles();
  const baseUrl = 'https://s3-us-west-1.amazonaws.com/deepcell-data';
  const moreInfoUrl = 'https://github.com/vanvalenlab/intro-to-deepcell/tree/master/pretrained_models';

  const imageSizeWarning = 'Image files should be no larger than 2048x2048.';

  return (
    <Card className={classes.card}>
      <CardMedia
        className={classes.cardMedia}
        image={`${baseUrl}/${thumbnail}`}
        title={`${name}`}
      />
      <CardContent className={classes.cardContent}>
        <Typography gutterBottom variant="h5">
          { name }
        </Typography>
        <Typography variant="subtitle1">
          { description }
        </Typography>
        <br />
        <Typography variant="subtitle1">
          { imageSizeWarning }
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          color="primary"
          target="_blank"
          href={`${baseUrl}/${file}`}>
          Download Image
        </Button>
        <Button
          size="small"
          color="primary"
          target="_blank"
          href={moreInfoUrl}>
          Learn More
        </Button>
      </CardActions>
    </Card>
  );
}

JobCard.propTypes = {
  file: PropTypes.string,
  name: PropTypes.string,
  description: PropTypes.string,
  thumbnail: PropTypes.string,
};
