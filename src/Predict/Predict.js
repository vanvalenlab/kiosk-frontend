import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import FileUpload from '../FileUpload/FileUpload';
import './Predict.css';

const styles = theme => ({
  root: {
    flexGrow: 1,
    margin: theme.spacing.unit * 4,
    paddingTop: theme.spacing.unit * 2
  },
  progress: {
    margin: theme.spacing.unit * 2,
  },
  button: {
    display: 'block',
    marginTop: theme.spacing * 2,
  },
  formControl: {
    minWidth: 220,
  },
});

class Predict extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileName: '',
      imageUrl: '',
      downloadURL: null,
      submitted: false,
      showError: false,
      errorText: '',
      cellTracking: '',
      dataRescale: 'true',
      setOpen: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.canBeSubmitted = this.canBeSubmitted.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
  }

  componentDidMount() {
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
      let errMsg = `Job Failed: ${response.data.value}`;
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
    }).catch(error => {
      let errMsg = `Failed to expire redis hash due to error: ${error}`;
      this.showErrorMessage(errMsg);
    });
  }

  checkJobStatus(redisHash, interval) {
    this.statusCheck = setInterval(() => {
      axios({
        method: 'post',
        url: '/api/status',
        data: { 'hash': redisHash }
      }).then((response) => {
        if (response.data.status === 'failed') {
          clearInterval(this.statusCheck);
          this.getErrorReason(redisHash);
          this.expireRedisHash(redisHash, 3600);
        } else if (response.data.status === 'done') {
          clearInterval(this.statusCheck);
          axios({
            method: 'post',
            url: '/api/redis',
            data: {
              'hash': redisHash,
              'key': 'output_url'
            }
          }).then((response) => {
            this.setState({
              downloadURL: response.data.value
            });
            this.expireRedisHash(redisHash, 3600);
          }).catch(error => {
            let errMsg = `Job finished. Error fetching output URL: ${error}`;
            this.showErrorMessage(errMsg);
          });
        }
      }).catch(error => {
        let errMsg = `Trouble communicating with Redis due to error: ${error}`;
        this.showErrorMessage(errMsg);
      });
    }, interval);
  }

  predict() {
    axios({
      method: 'post',
      url: '/api/predict',
      timeout: 60 * 4 * 1000, // 4 minutes
      data: {
        'imageName': this.state.fileName,
        'uploadedName': this.state.uploadedFileName,
        'imageUrl': this.state.imageUrl,
        'cellTracking' : this.state.cellTracking,
        'dataRescale': this.state.dataRescale
      }
    }).then((response) => {
      this.checkJobStatus(response.data.hash, 3000);
    }).catch(error => {
      let errMsg = `Failed to create job due to error: ${error}.`;
      this.showErrorMessage(errMsg);
    });
  }

  canBeSubmitted() {
    return (
      this.state.fileName.length > 0 &&
      this.state.imageUrl.length > 0
    );
  }

  handleSubmit(event) {
    if (!this.canBeSubmitted()) {
      event.preventDefault();
      return;
    }
    this.setState({ submitted: true });
    this.predict();
  }

  handleChange(event) {
    if(!this.isCancelled) {
      this.setState({
        [event.target.name]: event.target.value
      });
    }
  }

  handleClose() {
    this.setState({setOpen : false});
  }

  handleOpen() {
    this.setState({setOpen : true});
  }



  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Typography
          variant='title'
          align='center'
          color='textSecondary'
          paragraph
          style={{ 'paddingBottom': '1em' }}>
          Select Options | Upload your image | Download the results.
        </Typography>

        <Grid container direction="row" justify="center" alignItems="center">
          <form autoComplete='off'>
            <Grid container direction="row" justify="center" alignItems="center">
              <Grid item xs={6}>
                <Paper className='selection'>
                  <Button onClick={this.handleOpen}>
                    Cell Tracking
                  </Button>
                  <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="cellTrackingValue">Data Type</InputLabel>
                    <Select
                      open={this.state.setOpen}
                      onClose={this.handleClose}
                      onOpen={this.handleOpen}
                      onChange={this.handleChange}
                      value={this.state.cellTracking}
                      inputProps={{
                        name: 'cellTracking',
                        id: 'cellTrackingValue',
                      }}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value={'segmentation'}>Segmentation</MenuItem>
                      <MenuItem value={'tracking'}>Tracking</MenuItem>

                    </Select>
                  </FormControl>
                </Paper>
              </Grid>
            
              <Grid item xs={6} className='uploader'>
                <FileUpload
                  infoText='Upload Here to Begin Image Prediction.'
                  onDroppedFile={(uploadedName, fileName, url) =>
                    this.setState({
                      uploadedFileName: uploadedName,
                      fileName: fileName,
                      imageUrl: url
                    })} />
              </Grid>
            </Grid>
            { this.state.showError ?
              <Typography
                variant='subheading'
                align='center'
                color='error'
                paragraph
                style={{ 'paddingTop': '1em' }}>
                {this.state.errorText}
              </Typography>
              : null }

            { !this.state.submitted ?
              <Grid id='submitButtonWrapper' item lg style={{ 'paddingTop': '1em' }}>
                <Button
                  id='submitButton'
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

            { this.state.submitted && !this.state.showError && this.state.downloadURL === null ?
              <Grid item lg style={{ 'paddingTop': '2em' }}>
                <LinearProgress className={classes.progress} />
              </Grid>
              : null }

            { this.state.downloadURL !== null ?
              <div>
                <Grid item lg style={{ 'paddingTop': '2em' }}>
                  <Button
                    href={this.state.downloadURL}
                    variant='contained'
                    size='large'
                    fullWidth
                    color='secondary'>
                    Download Results
                  </Button>
                </Grid>

                <Grid item lg style={{ 'paddingTop': '2em' }}>
                  <Button
                    href='/predict'
                    variant='contained'
                    size='large'
                    fullWidth
                    color='primary'>
                    Submit New Image
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

Predict.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Predict);
