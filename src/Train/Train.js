import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import LinearProgress from '@material-ui/core/LinearProgress';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import Slider from '@material-ui/lab/Slider';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import FileUpload from '../FileUpload/FileUpload';
import FormLabel from '@material-ui/core/FormLabel';
import './Train.css';

const styles = theme => ({
  root: {
    flexGrow: 1,
    margin: theme.spacing.unit * 4
  },
  form: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
  progress: {
    margin: theme.spacing.unit * 2,
  },
  selection: {
    padding: theme.spacing.unit * 2,
  },
});

class Train extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      optimizer: 'sgd',
      fieldSize: 60,
      fileName: '',
      dataUrl: '',
      submitted: false,
      downloadURL: null,
      skips: 0,
      epochs: 10,
      transform: '',
      normalization: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.canBeSubmitted = this.canBeSubmitted.bind(this);
  }

  componentWillUnmount() {
    this.isCancelled = true;
  }

  train() {
    axios({
      method: 'post',
      url: '/api/train',
      timeout: 60 * 4 * 1000, // 4 minutes
      data: {
        optimizer: this.state.optimizer,
        fieldSize: this.state.fieldSize + 1,
        imageURL: this.state.dataUrl,
        imageName: this.state.fileName,
        skips: this.state.skips,
        epochs: this.state.epochs,
        transform: this.state.transform,
        normalization: this.state.normalization
      }
    })
      .then((response) => {
        console.log(response.data);
        !this.isCancelled && this.setState({
          trainResponse: response.data
        });
      })
      .catch(error => {
        console.log(`Error occurred during POST to /api/train: ${error}`);
      });
  }

  handleSubmit(event) {
    if (!this.canBeSubmitted()) {
      event.preventDefault();
      return;
    }
    this.setState({ submitted: true });
    this.train();
  }

  handleChange(event) {
    !this.isCancelled && this.setState({
      [event.target.name]: event.target.value
    });
  }

  canBeSubmitted() {
    return (
      this.state.fieldSize > 0 &&
      this.state.epochs > 0 &&
      this.state.optimizer.length > 0 &&
      this.state.fileName.length > 0 &&
      this.state.dataUrl.length > 0
    );
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Grid container spacing={40} justify='space-evenly'>
          <form autoComplete='off'>

            <Paper className='trainingSelection'>
              <Grid item xs>
                <FormLabel>Optimizer Type</FormLabel>
                <FormControl className={classes.formControl}>
                  <Select
                    value={this.state.optimizer}
                    input={<Input name='optimizer' id='optimizer-placeholder' placeholder='' />}
                    onChange={this.handleChange}
                    displayEmpty
                    className={classes.selectEmpty}>
                    <MenuItem value=''>
                      <em>Optimizer</em>
                    </MenuItem>
                    <MenuItem value='sgd'>
                      SGD
                    </MenuItem>
                    <MenuItem value='adam'>
                      Adam
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs>
                <FormLabel>Transform</FormLabel>
                <FormControl className={classes.formControl}>
                  <Select
                    value={this.state.transform}
                    input={<Input name='transform' id='transform-placeholder' placeholder='' />}
                    onChange={this.handleChange}
                    displayEmpty
                    className={classes.selectEmpty}>
                    <MenuItem value=''>
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value='deepcell'>
                      Deepcell
                    </MenuItem>
                    <MenuItem value='watershed'>
                      Watershed
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs>
                <FormLabel>Receptive Field Size:</FormLabel>
                <Typography id='field-slider-label'>{this.state.fieldSize + 1}</Typography>
                <Slider
                  value={this.state.fieldSize + 1}
                  aria-labelledby='field-slider-label'
                  min={10}
                  max={120}
                  step={2}
                  onChange={ (e, v) => this.setState({ fieldSize: v }) } />
              </Grid>

              <Grid item xs>
                <FormLabel>Skip Connections:</FormLabel>
                <Typography id='skip-slider-label'>{this.state.skips}</Typography>
                <Slider
                  value={this.state.skips}
                  aria-labelledby='skip-slider-label'
                  min={0}
                  max={5}
                  step={1}
                  onChange={ (e, v) => this.setState({ skips: v }) } />
              </Grid>

              <Grid item xs>
                <FormLabel>Epochs:</FormLabel>
                <Typography id='epoch-slider-label'>{this.state.epochs}</Typography>
                <Slider
                  value={this.state.epochs}
                  aria-labelledby='epoch-slider-label'
                  min={1}
                  max={100}
                  step={1}
                  onChange={ (e, v) => this.setState({ epochs: v }) } />
              </Grid>

              <Grid item xs>
                <FormLabel>Normalization Method</FormLabel>
                <FormControl className={classes.formControl}>
                  <Select
                    value={this.state.normalization}
                    input={<Input name='normal' id='normal-placeholder' placeholder='' />}
                    onChange={this.handleChange}
                    displayEmpty
                    className={classes.selectEmpty}>
                    <MenuItem value=''>
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value='median'>
                      Median
                    </MenuItem>
                    <MenuItem value='std'>
                      Standard Deviation
                    </MenuItem>
                    <MenuItem value='max'>
                      Maximum
                    </MenuItem>
                    <MenuItem value='whole_image'>
                      Whole Image
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

            </Paper>

            <Grid item xs className='uploader'>
              <FileUpload
                infoText='Upload Here to Begin Training.'
                onDroppedFile={(fileName, url) =>
                  this.setState({ fileName: fileName, dataUrl: url })} />
            </Grid>

            { !this.state.submitted ?
              <Grid item lg style={{'paddingTop': '2em'}}>
                <Button
                  variant='contained'
                  onClick={this.handleSubmit}
                  size='large'
                  fullWidth
                  disabled={!this.canBeSubmitted()}
                  color='primary'>
                  Submit
                </Button>
              </Grid>
              : null }

            { this.state.submitted && this.state.downloadURL === null  ?
              <Grid item lg style={{'paddingTop': '2em'}}>
                <LinearProgress className={classes.progress} />
              </Grid>
              : null }

          </form>
        </Grid>
      </div>
    );
  }
}

Train.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Train);
