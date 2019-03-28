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

//Styles Object for MaterialUI styling
const styles = theme => ({
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

//!!!!!!!!!!!Class Declaration for DataCard Component !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
class DataCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      baseUrl :'https://s3-us-west-1.amazonaws.com/deepcell-data/nuclei/examples',
      cardType: this.props.cardType,
      exampleallCards: [],
      trainingCards: [],
      cardsInUse: [],
      allCards :[
        {
          file: 'HeLa_nuclear.png',
          name: 'HeLa Nuclei',
          description: 'Nuclear stains of HeLa S3',
          datatype: 'example'
        },
        {
          file: 'mibi_nuclear.png',
          name: 'MIBI Nuclei',
          description: 'Double-stranded DNA data from MIBI',
          datatype: 'example'
        },
        {
          file: 'mousebrain.tif',
          name: 'Mouse Brain Nuclei',
          description: 'Mouse embryo nuclei Z-stack',
          datatype: 'example'
        },
        {
          file: 'tracked/tracking_HeLa_S3.zip',
          name: 'HeLa S3 Raw + Segmentation',
          description: 'Raw tracked example data and segmentations to submit for tracking',
          datatype: 'example'
        },
        {
          file: 'training_HeLa_S3.zip',
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
    //Binding the function's name call to the "this" key word for this Class object, rather than the function HandleChange.
    //refer to: https://stackoverflow.com/questions/32317154/react-uncaught-typeerror-cannot-read-property-setstate-of-undefined
    this.organizeCardTypes = this.organizeCardTypes.bind(this);
  }

  componentDidMount() {
    this.organizeCardTypes();
  }


  organizeCardTypes(){
    console.log("Rendered!");
    let cards = this.state.allCards;
    let trainingCards = [];
    let exampleCards =[];
    let cardTypeFromProps = this.state.cardType;
    console.log("The Tab's props is: " + cardTypeFromProps);
    //iterating through each entry in the cards array.
    for(let i=0; i<cards.length;i++){
      console.log("Card of i: " + cards[i])
      // iterating through each object in each cards entry.
      for(let key in cards[i] ){
        console.log("Card of i of key: " + cards[i][key])
        if(key === 'datatype' && cards[i][key] === 'training' ){
          trainingCards.push(cards[i]);
        }
        else if(key === 'datatype' && cards[i][key] === 'example' ){
          exampleCards.push(cards[i]);
        }
      }      
    }
    if(cardTypeFromProps === 'example'){
      console.log("Rendering example Card Types: " + exampleCards.length);
      this.setState({cardsInUse:exampleCards});
    }
    if(cardTypeFromProps === 'training'){
      console.log("Rendering training Card Types: " + trainingCards);
      this.setState({cardsInUse:trainingCards});
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
          <Grid container spacing={40}>
            {this.state.cardsInUse.map(card => (
              //Grid A1
              <Grid item key={this.state.allCards.indexOf(card)} xs={12} sm={4}>
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

DataCard.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(DataCard);