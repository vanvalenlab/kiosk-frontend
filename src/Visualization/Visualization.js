import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import * as d3 from 'd3';
import {divergingBarChart} from './barchart.js';
import './Visualization.css';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    overflowX: 'hidden'
  },
  paper: {
    padding: theme.spacing.unit * 4,
    textAlign: 'center',
    verticanAlign: 'top',
    width: '30em',
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
      objectMetrics:[],
      pixelMetrics:[]
    };
  }

  componentDidMount() {
    this.getModelJSON();
  }

  /*  */

  // Upon the mounting of the component, this function is run within componentDidMount
  // in order to get the relevant statistics data about the selected model.
  getModelJSON(){
    axios.get('/api/getModelStats')
      .then((response) => {
        this.setState({
          modelJSON: response.data.modelJSON
        });
        this.modelInfo();
        this.drawChart();
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
    //Store the modelJSON obj in a var, separate it by it's only two possible keys - either 'metadata' or 'metrics'.
    //modelInfo, data type is a javascript object. This will be used for populating basic info about the selected Model.
    var modelInfo = modelStats.metadata;
    //modelMetrics, data type is an array. Will be used to distill visualization and statistics.
    var modelMetrics = modelStats.metrics;

    //Separate the various metrics objects by their type, which is either 'pixel' or 'object'.
    var objectTypes= [];
    var pixelTypes = [];
    //Begin iteration through modelMetrics array (Array).
    for(var i=0; i<modelMetrics.length; i++){
      var metricsContent = modelMetrics[i];
      //iterate through each metrics object and check it's 'stat_type' property.
      //Push the object into it's corresponding array container.
      for(var key in metricsContent){
        //if type Object
        if(key === 'stat_type' && metricsContent[key] === 'object'){
          objectTypes.push(metricsContent);
        }
        //if type Pixel
        if(key === 'stat_type' && metricsContent[key] === 'pixel'){
          pixelTypes.push(metricsContent);
        }
      }
    }

    this.setState({
      modelInfo: modelInfo,
      objectMetrics: objectTypes,
      pixelMetrics: pixelTypes
    });

  }

  drawChart(){
    // const data is of type array. The array contains objects.
    const metrics = this.state.objectMetrics;
    //Sorting the array by number, based on the value key.
    metrics.sort(function(a, b){return a.value-b.value;});
    const data = [];
    const n_true = [];
    const n_pred = [];
    for (var i = 0; i < metrics.length; ++i) {
      for(var key in metrics[i]){
        if(key === 'name'){
          if(metrics[i][key] !== 'n_true' && metrics[i][key] !=='n_pred'){
            data.push({ data: metrics[i].value, label: metrics[i].name });
          }
          if(metrics[i][key] === 'n_true'){
            n_true.push({ data: metrics[i].value, label: metrics[i].name });
          }
          if(metrics[i][key] ==='n_pred'){
            n_pred.push({ data: metrics[i].value, label: metrics[i].name });
          }
        }
      }
    }
    var chart = divergingBarChart();
    d3.select('#chart').datum(data).call(chart);
    d3.select('#n_true').datum(n_true).call(chart);
    d3.select('#n_pred').datum(n_pred).call(chart);
    //resize() function utilized on the window.
    d3.select(window).on('resize', resize);

    // Reusable resizing function that affects the svgs utilized in the chart.
    function resize() {
      if (d3.select('#chart svg').empty()) {
        return;
      }
      var w = +d3.select('#chart').style('width').replace(/(px)/g, '');
      chart.width(w);
      chart.height(200);
      d3.select('#chart').call(chart);
    }
  }


  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Grid container alignItems='flex-start' justify='flex-start' direction='row'>
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
              { this.state.modelInfo !== null ?
                <div className='modelInfoParent'>
                  <Typography
                    variant='body1'
                    align='left'
                    color='textSecondary'
                    paragraph
                    style={{}}>
                    Model Name:
                  </Typography>

                  <Typography
                    color='textSecondary'
                    paragraph
                  >{JSON.stringify(this.state.selectedModel)}
                  </Typography>

                  <Typography
                    variant='body1'
                    align='left'
                    color='textSecondary'
                    paragraph
                    style={{}}>
                    Date of Data Collection:
                  </Typography>

                  <Typography
                    color='textSecondary'
                    paragraph                  
                  >{JSON.stringify(this.state.modelInfo.date)}
                  </Typography>

                  <Typography
                    variant='body1'
                    align='left'
                    color='textSecondary'
                    paragraph
                    style={{}}>
                    Notes:
                  </Typography>

                  <Typography
                    color='textSecondary'
                    paragraph                  
                  >{JSON.stringify(this.state.modelInfo.notes)}
                  </Typography>                
                </div>
                : null }
              <div id='n_true'></div>
              <div id='n_pred'></div>
              <div id='chart'></div>
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