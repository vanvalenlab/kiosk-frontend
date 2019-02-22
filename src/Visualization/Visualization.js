import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import './Visualization.css';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  paper: {
    padding: theme.spacing.unit * 10,
    textAlign: 'center',
    verticanAlign: 'top',
    color: theme.palette.text.secondary,
  },
});

class Visualization extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedModel: this.props.selectedModel,
      showError: false,
      errorText: '',
      modelJSON:null,
      modelInfo:null,
      modelMetrics:null
    };
  }

  componentDidMount() {
    console.log(this.props.selectedModel + 'was loaded.');
    this.getModelJSON();
  }

  componentWillUnmount() {
  }

  // Upon the mounting of the component, this function is run within componentDidMount
  // in order to get the relevant statistics data about the selected model.
  getModelJSON(){
    axios.get('/api/getModelStats')
      .then((response) => {
        this.setState({
          modelJSON: response.data.modelJSON
        });
        this.modelInfo();
      }).catch(error =>{
        let errMsg = `Could not visualize Model stats from cloud bucket due to error: ${error}`;
        this.showErrorMessage(errMsg);
      });
  }
  // Re-usable Error Message Function
  showErrorMessage(errorText) {
    this.setState({
      showError: true,
      errorText: errorText
    });
  }

  modelInfo(){
    var modelStats = this.state.modelJSON;
    //Store the modelJSON obj in a var, separate it by it's only two possible keys - either "metadata" or "metrics".
    //modelInfo, data type is a javascript object. This will be used for populating basic info about the selected Model.
    var modelInfo = modelStats.metadata;
    //modelMetrics, data type is an array. Will be used to distill visualization and statistics.
    var modelMetrics = modelStats.metrics;

    //Separate the various metrics objects by their type, which is either "pixel" or "object".
    var objectMetrics = [];
    var pixelMetrics = [];
    //Begin iteration through modelMetrics array (Array).
    for(var i=0; i<modelMetrics.length; i++){
      var metricsContent = modelMetrics[i];
      //iterate through each metrics object and check it's 'stat_type' property.
      //Push the object into it's corresponding array container.
      for(var key in metricsContent){
        //if type Object
        if(key === 'stat_type' && metricsContent[key] === 'object'){
          objectMetrics.push(metricsContent);
        }
        //if type Pixel
        if(key === 'stat_type' && metricsContent[key] === 'pixel'){
          pixelMetrics.push(metricsContent);
        }
      }
    }

    this.setState({
      modelInfo: modelStats.modelInfo
    });
    
    console.log('Model stats var entered: ' + JSON.stringify(modelInfo));

    
  }


  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Grid container alignItems="flex-start" justify='flex-start' direction="row">
          <Grid item>
            <Paper className={classes.paper}>
              <Typography
                variant='title'
                align='center'
                color='textSecondary'
                paragraph
                style={{}}>
                Model Stats
              </Typography>
              <Typography
                variant='body1'
                align='left'
                color='primary'
                paragraph
                style={{}}>
                Model Name: 
              </Typography>
              <Typography
                variant='body1'
                align='left'
                color='primary'
                paragraph
                style={{}}>
                Date of Data Collection:
              </Typography>
              <Typography
                variant='body1'
                align='left'
                color='primary'
                paragraph
                style={{}}>
                Notes:
              </Typography>
              {JSON.stringify(this.state.modelJSON)}
            </Paper>        
          </Grid>
        </Grid>
      </div>
    );
  }
}

Visualization.propTypes = {
  selectedModel: PropTypes.string,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Visualization);