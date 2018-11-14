import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import LinearProgress from '@material-ui/core/LinearProgress';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
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
    minWidth: 120
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
      fileName: '',
      imageURL: '',
      optimizer: 'sgd',
      fieldSize: 60,
      submitted: false,
      tensorboardUrl: null,
      ndim: '2',
      trainingType: 'conv',
      skips: 0,
      epochs: 10,
      transform: '',
      normalization: 'std',
      showError: false,
      errorText: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.canBeSubmitted = this.canBeSubmitted.bind(this);
  }

  componentWillUnmount() {
    this.isCancelled = true;
  }

  showErrorMessage(errorText) {
    this.setState({
      showError: true,
      errorText: errorText
    });
  }

  getErrorReason(redisHash) {
    axios({
      method: 'post',
      url: '/api/redis',
      data: {
        'hash': redisHash,
        'key': 'reason'
      }
    }).then((response) => {
      let errMsg = `Job Failed: ${response.data.reason}`;
      this.showErrorMessage(errMsg);
    }).catch(error => {
      let errMsg = `Failed to get failure reason due to error: ${error}`;
      this.showErrorMessage(errMsg);
    });
  }

  expireRedisHash(redisHash, expireIn) {
    axios({
      method: 'post',
      url: '/api/redis/expire',
      data: {
        'hash': redisHash,
        'expireIn': expireIn
      }
    }).then((response) => {
      if (parseInt(response.data.value) !== 1) {
        this.showErrorMessage('Hash not expired');
      }
    }).catch((error) => {
      let errMsg = `Failed to expire redis hash due to error: ${error}`;
      this.showErrorMessage(errMsg);
    });
  }

  checkJobStatus(redisHash, interval) {
    this.statusCheck = setInterval(() => {
      axios({
        method: 'post',
        url: '/api/redis',
        data: {
          'hash': redisHash,
          'key': 'status'
        }
      }).then((response) => {
        if (response.data.value === 'failed') {
          clearInterval(this.statusCheck);
          this.getErrorReason(redisHash);
        } else if (response.data.value === 'training') {
          clearInterval(this.statusCheck);
          axios({
            method: 'post',
            url: '/api/redis',
            data: {
              'hash': redisHash,
              'key': 'model'
            }
          }).then((response) => {
            this.setState({
              tenorboardUrl: `/tensorboard/${response.data.value}`
            });
            this.expireRedisHash(redisHash, 3600);
          }).catch(error => {
            let errMsg = `Model is training but could not get model name due to error: ${error}`;
            this.showErrorMessage(errMsg);
          });
        }
      }).catch(error => {
        let errMsg = `Could not get status from redis due to error: ${error}.`;
        this.showErrorMessage(errMsg);
      });
    }, interval);
  }

  train() {
    axios({
      method: 'post',
      url: '/api/train',
      timeout: 60 * 4 * 1000, // 4 minutes
      data: {
        optimizer: this.state.optimizer,
        fieldSize: this.state.fieldSize + 1,
        imageURL: this.state.imageURL,
        imageName: this.state.fileName,
        skips: this.state.skips,
        ndim: this.state.ndim,
        trainingType: this.state.trainingType,
        epochs: this.state.epochs,
        transform: this.state.transform,
        normalization: this.state.normalization
      }
    }).then((response) => {
      // job was submitted, update status until failed or training
      this.checkJobStatus(response.data.hash, 3000);
    }).catch(error => {
      let errMsg = `Failed to put training job in the queue due to error: ${error}`;
      this.showErrorMessage(errMsg);
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
      this.state.imageURL.length > 0
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
                <FormControl component='fieldset' className={classes.formControl}>
                  <FormLabel component='legend'>Training Method:</FormLabel>
                  <RadioGroup
                    aria-label='trainingType-label'
                    name='trainingType'
                    row={true}
                    value={this.state.trainingType}
                    onChange={this.handleChange}>
                    <FormControlLabel value='conv' control={<Radio />} label='conv' />
                    <FormControlLabel value='sample' control={<Radio />} label='sample' />
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid item xs>
                <FormLabel>Optimizer Type:</FormLabel>
                <FormControl className={classes.formControl}>
                  <Select
                    value={this.state.optimizer}
                    input={<Input name='optimizer' id='optimizer-placeholder' placeholder='' />}
                    onChange={this.handleChange}
                    displayEmpty>
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
                <FormLabel>Transform:</FormLabel>
                <FormControl className={classes.formControl}>
                  <Select
                    value={this.state.transform}
                    input={<Input name='transform' id='transform-placeholder' placeholder='' />}
                    onChange={this.handleChange}
                    displayEmpty>
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
                <FormControl component='fieldset' className={classes.formControl}>
                  <FormLabel component='legend'>Data Dimensionality:</FormLabel>
                  <RadioGroup
                    aria-label='ndim-label'
                    name='ndim'
                    row={true}
                    className={classes.group}
                    value={this.state.ndim}
                    onChange={this.handleChange}>
                    <FormControlLabel value='2' control={<Radio />} label='2D' />
                    <FormControlLabel value='3' control={<Radio />} label='3D' />
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid item xs>
                <FormLabel>Normalization Method:</FormLabel>
                <FormControl className={classes.formControl}>
                  <Select
                    value={this.state.normalization}
                    input={<Input name='normalization' id='normalization-placeholder' placeholder='' />}
                    onChange={this.handleChange}
                    displayEmpty>
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
                infoText='Upload Training Data Here.'
                onDroppedFile={(fileName, url) =>
                  this.setState({ fileName: fileName, imageURL: url })} />
            </Grid>

            { this.state.showError ?
              <Typography
                variant='subheading'
                align='center'
                color='error'
                paragraph
                style={{'paddingTop': '1em'}}>
                {this.state.errorText}
              </Typography>
              : null }

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

            { this.state.submitted && !this.state.showError && this.state.tensorboardUrl === null ?
              <Grid item lg style={{'paddingTop': '2em'}}>
                <LinearProgress className={classes.progress} />
              </Grid>
              : null }

            { this.state.tensorboardUrl !== null ?
              <div>
                <Grid item lg style={{'paddingTop': '2em'}}>
                  <Button
                    href={this.state.tensorboardUrl}
                    variant='contained'
                    size='large'
                    fullWidth
                    color='secondary'>
                    Go to TensorBoard
                  </Button>
                </Grid>

                <Grid item lg style={{'paddingTop': '2em'}}>
                  <Button
                    href='/train'
                    variant='contained'
                    size='large'
                    fullWidth
                    color='primary'>
                    Train another model
                  </Button>
                </Grid>
              </div>
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
