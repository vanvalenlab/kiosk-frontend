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
import * as util from 'util';

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

//This function is described before the Class declaration for the Data component, below.
function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}
//propType description for React to check data type when TabContainer jsx instances are given prop's.
TabContainer.propTypes = {
  children: PropTypes.node.isRequired
};

//!!!!!!!!!!!Class Declaration for Data Component !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
class Data extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value:'one',
      baseUrl :'https://s3-us-west-1.amazonaws.com/deepcell-data/nuclei/examples',
      cards :[
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
      ],
    };
    this.handleChange = this.handleChange.bind(this);
  }

  //Function to set the index of the <Tab> child being parametized. (https://material-ui.com/api/tabs/)
  handleChange(event,value){
    console.log("event: " + util.inspect(event.target));
    console.log("value: " + value);
    this.setState({ value: value });
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
        <AppBar position="static" color="default">
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab value="one" label="New Arrivals in the Longest Text of Nonfiction" />
            <Tab value="two" label="Item Two" />
          </Tabs>
        </AppBar>

        {this.state.value === 'one' && <TabContainer >Item One</TabContainer>}
        {this.state.value === 'two' && <TabContainer >Item Two</TabContainer>}
        {/* Bottom Data Card Display Area */}
        <div className={classNames(classes.layout, classes.cardGrid)}>
          {/* Grid A */}
          <Grid container spacing={40}>
            {this.state.cards.map(card => (
              //Grid A1
              <Grid item key={this.state.cards.indexOf(card)} xs={12} sm={4}>
                <Card className={classes.card}>
                  <CardMedia
                    className={classes.cardMedia}
                    image={`${this.state.baseUrl}/${card.file}`}
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
                      href={`${this.state.baseUrl}/${card.file}`}>
                      Download
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
              //Grid A1
            ))}
          </Grid>
          {/* Grid A */}
        </div>
        {/* Bottom Data Card Display Area */}
      </div>
      //END Outermost Div
    );
  }
}

Data.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Data);
