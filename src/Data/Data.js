import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import SwipeableViews from 'react-swipeable-views';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

//This function is described before the Class declaration for the Data component, below.
function TabContainer({ children, dir }) {
  return (
    <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}

//propType description for React to check data type when TabContainer jsx instances are given prop's.
TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired,
};

//Styles Object for MaterialUI styling
const styles = theme => ({
  heroUnit: {
    backgroundColor: theme.palette.background.paper,
  },
  heroContent: {
    maxWidth: 600,
    margin: '0 auto',
    padding: `${theme.spacing.unit * 8}px 0 ${theme.spacing.unit * 6}px`,
  },
  heroButtons: {
    marginTop: theme.spacing.unit * 4,
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
      width: 1100,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  cardGrid: {
    padding: `${theme.spacing.unit * 8}px 0`,
  },
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
});

//Static dev information for testing data cards.
const baseUrl = 'https://s3-us-west-1.amazonaws.com/deepcell-data/nuclei/examples';
const cards = [
  {
    file: 'nuclei/examples/HeLa_nuclear.png',
    name: 'HeLa Nuclei',
    description: 'Nuclear stains of HeLa S3',
    datatype: 'example'
  },
  {
    file: 'nuclei/examples/mibi_nuclear.png',
    name: 'MIBI Nuclei',
    description: 'Double-stranded DNA data from MIBI',
    datatype: 'example'
  },
  {
    file: 'nuclei/examples/mousebrain.tif',
    name: 'Mouse Brain Nuclei',
    description: 'Mouse embryo nuclei Z-stack',
    datatype: 'example'
  },
  {
    file: 'tracked/tracking_HeLa_S3.zip',
    name: 'HeLa S3 Raw + Segmentation',
    description: 'Raw data and segmentations to submit for tracking',
    datatype: 'example'
  },
  {
    file: 'nuclei/examples/training_HeLa_S3.zip',
    name: 'Training Data - HeLa S3 Nuclei',
    description: 'Training data for the HeLa S3 nuclei',
    datatype: 'training'
  },
  {
    file: 'tracked/HeLa_S3.trks',
    name: 'Tracked Training Data - HeLa S3 Nuclei',
    description: 'Tracked training data for the HeLa S3 nuclei',
    datatype: 'training'
  },
  {
    file: 'tracked/3T3_NIH.trks',
    name: 'Tracked Training Data - NIH 3T3 Nuclei',
    description: 'Tracked training data for the NIH 3T3 nuclei',
    datatype: 'training'
  }
];

//Class Declaration for Data Component
class Data extends React.Component {
  state = {
    value: 0,
  };

  //Function to set the index of the child being parametized. (https://material-ui.com/api/tabs/)
  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };

  render() {
    const { classes } = this.props;

    return(
      // Outermost Div
      <div>
        {/* Top Banner Area */}
        <div className={classes.heroUnit}>
          <div className={classes.heroContent}>
            <Typography variant="display3" align="center" color="textPrimary" gutterBottom>
              Example Image Data
            </Typography>
            <Typography variant="title" align="center" color="textSecondary" paragraph>
              Here are some images that you can download and submit to the models
              to see how deepcell works!
            </Typography>
          </div>
        </div>
        {/* Top Banner Area - END */}
        {/* Bottom Data Card Display Area */}
        <div className={classNames(classes.layout, classes.cardGrid)}>
          <Grid container spacing={40}>
            {cards.map(card => (
              <Grid item key={cards.indexOf(card)} xs={12} sm={4}>
                <Card className={classes.card}>
                  <CardMedia
                    className={classes.cardMedia}
                    image={`${baseUrl}/${card.file}`}
                    title={`${card.name}`}
                  />
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="headline" component="h2">
                      { card.name }
                    </Typography>
                    <Typography>
                      { card.description }
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      color="primary"
                      target="_blank"
                      href={`${baseUrl}/${card.file}`}>
                      Download
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>
        {/* Bottom Data Card Display Area */}
      </div>
      //END Outermost Div
    );
  }
}

Data.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Data);
