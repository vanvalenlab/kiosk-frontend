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

// Styles Object for MaterialUI styling
const styles = theme => ({
  layout: {
    width: 'auto',
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    [theme.breakpoints.up(1100 + theme.spacing(3) * 2)]: {
      width: 1100,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  cardGrid: {
    padding: `${theme.spacing(8)}px 0`,
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

//!!!!!!!!!!!Class Declaration for DataCard Component !!!!!!!!!!!!!!!!!!!!!!!!!!
class DataCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      baseUrl: 'https://s3-us-west-1.amazonaws.com/deepcell-data',
      cardType: this.props.cardType,
      cardsInUse: [],
      allCards :[
        {
          file: 'nuclei/examples/HeLa_nuclear.png',
          name: 'HeLa Nuclei',
          description: 'Nuclear stains of HeLa S3',
          thumbnail: 'thumbnails/HeLa_nuclear.png',
          datatype: 'prediction'
        },
        // {
        //   file: 'nuclei/examples/mibi_nuclear.png',
        //   name: 'MIBI Nuclei',
        //   description: 'Double-stranded DNA data from MIBI',
        //   thumbnail: 'thumbnails/mibi_nuclear.png',
        //   datatype: 'prediction'
        // },
        {
          file: 'tiff_stack_examples/mibi_5channels.tif',
          name: 'MIBI Whole Cell',
          description: '5 channel cellular marker data from MIBI',
          thumbnail: 'thumbnails/mibi_nuclear.png',
          datatype: 'prediction'
        },
        {
          file: 'spot_detection.tif',
          name: 'FISH Dots',
          description: 'Spot Detection data from seqFISH',
          thumbnail: 'thumbnails/spot_detection.png',
          datatype: 'prediction'
        },
        // {
        //   file: 'nuclei/examples/mousebrain.tif',
        //   name: 'Mouse Brain Nuclei',
        //   description: 'Mouse embryo nuclei Z-stack',
        // thumbnail: 'thumbnails/HeLa_nuclear.png',
        //   datatype: 'prediction'
        // },
        // {
        //   file: 'tracked/tracking_HeLa_S3.zip',
        //   name: 'HeLa S3 Raw + Segmentation',
        //   description: 'Raw tracked example data and segmentations to submit for tracking',
        //   thumbnail: 'thumbnails/HeLa_nuclear.png',
        //   datatype: 'prediction'
        // },
        {
          file: 'tiff_stack_examples/3T3_nuc_example_256.tif',
          name: '3T3 Nuclear Movie',
          description: 'Sample 3T3 nuclear movie for automated segmentation and tracking.',
          thumbnail: 'thumbnails/3T3_nuc_example_256.png',
          datatype: 'prediction'
        },
        // {
        //   file: 'tiff_stack_examples/3T3_cyto_example_256.tif',
        //   name: '3T3 Cytoplasm Movie (Fluorescence)',
        //   description: 'Sample 3T3 flourescent cytoplasm movie for automated segmentation and tracking.',
        //   thumbnail: 'thumbnails/3T3_cyto_example_256.png',
        //   datatype: 'prediction'
        // },
        // {
        //   file: 'tiff_stack_examples/3T3_phase_example_256.tif',
        //   name: '3T3 Ctyoplasm Movie (Phase)',
        //   description: 'Sample 3T3 brightfield movie for automated segmentation and tracking.',
        //   thumbnail: 'thumbnails/3T3_phase_example_256.png',
        //   datatype: 'prediction'
        // },
        {
          file: 'nuclei/examples/training_HeLa_S3.zip',
          name: 'Training Data - HeLa S3 Nuclei',
          description: 'Training data for the HeLa S3 nuclei',
          thumbnail: 'thumbnails/HeLa_nuclear.png',
          datatype: 'training'
        },
        {
          file: 'nuclei/examples/tracked/HeLa_S3.trks',
          name: 'Tracked Training Data - HeLa S3 Nuclei',
          description: 'Tracked training data for the HeLa S3 nuclei',
          thumbnail: 'thumbnails/HeLa_nuclear.png',
          datatype: 'training'
        },
        {
          file: 'nuclei/examples/tracked/3T3_NIH.trks',
          name: 'Tracked Training Data - NIH 3T3 Nuclei',
          description: 'Tracked training data for the NIH 3T3 nuclei',
          thumbnail: 'thumbnails/3T3_nuc_example_256.png',
          datatype: 'training'
        }
      ],
    };
    // Binding the function's name call to the "this" key word for this Class
    // object, rather than the function HandleChange.
    // refer to: https://stackoverflow.com/questions/32317154/react-uncaught-typeerror-cannot-read-property-setstate-of-undefined
    this.organizeCardTypes = this.organizeCardTypes.bind(this);
  }

  componentDidMount() {
    this.organizeCardTypes();
  }


  organizeCardTypes(){
    let cards = this.state.allCards;
    let trainingCards = [];
    let predictionCards =[];
    let cardTypeFromProps = this.state.cardType;

    //iterating through each entry in the cards array.
    for (let i = 0; i < cards.length; ++i) {
      // iterating through each object in each cards entry.
      for (let key in cards[i] ) {
        if (key === 'datatype' && cards[i][key] === 'training' ) {
          trainingCards.push(cards[i]);
        }
        else if (key === 'datatype' && cards[i][key] === 'prediction' ) {
          predictionCards.push(cards[i]);
        }
      }
    }
    if (cardTypeFromProps === 'prediction') {
      this.setState({ cardsInUse:predictionCards });
    }
    if (cardTypeFromProps === 'training') {
      this.setState({ cardsInUse:trainingCards });
    }
  }

  render() {
    const { classes } = this.props;

    return(
      // Outermost Div
      <div>
        {/* Bottom Data Card Display Area */}
        <div className={classNames(classes.layout, classes.cardGrid)}>
          {/* Grid A */}
          <Grid container spacing={4}>
            {this.state.cardsInUse.map(card => (
              //Grid A1
              <Grid item key={this.state.allCards.indexOf(card)} xs={12} sm={6} md={3}>
                <Card className={classes.card}>
                  <CardMedia
                    className={classes.cardMedia}
                    image={`${this.state.baseUrl}/${card.thumbnail}`}
                    title={`${card.name}`}
                  />
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h5">
                      { card.name }
                    </Typography>
                    <Typography variant="subtitle1">
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

DataCard.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  cardType: PropTypes.string.isRequired
};

export default withStyles(styles, { withTheme: true })(DataCard);
