import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Container from '@material-ui/core/Container';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import queryString from 'query-string';
import FileUpload from '../FileUpload/FileUpload';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  progress: {
    margin: theme.spacing(2),
  },
  paddedTop: {
    paddingTop: theme.spacing(4),
  },
  title: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(4),
    height: '100%',
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
      progress: 0,
      jobType: '',
      rescalingDisabled: 'true',
      rescaling: 1,
      setOpen: false,
      allJobTypes: [],
    };

    this.handleChange = this.handleChange.bind(this);
    this.canBeSubmitted = this.canBeSubmitted.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
  }

  componentDidMount() {
    this.getAllJobTypes();
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
        url: '/api/redis',
        data: {
          'hash': redisHash,
          'key': ['status', 'progress', 'output_url', 'reason', 'failures']
        }
      }).then((response) => {
        if (response.data.value[0] === 'failed') {
          clearInterval(this.statusCheck);
          this.showErrorMessage(`Job Failed: ${response.data.value[3]}`);
          this.expireRedisHash(redisHash, 3600);
        } else if (response.data.value[0] === 'done') {
          clearInterval(this.statusCheck);
          this.setState({ downloadURL: response.data.value[2] });
          this.expireRedisHash(redisHash, 3600);
          // This is only used during zip uploads.
          // Some jobs may fail while other jobs can succeed.
          const failures = response.data.value[4];
          if (failures != null && failures.length > 0) {
            const parsed = queryString.parse(failures);
            let errorText = 'Not all jobs completed!\n\n';
            for (const key in parsed) {
              errorText += `Job Failed: ${key}: ${parsed[key]}\n\n`;
            }
            this.showErrorMessage(errorText);
          }
        } else {
          let maybe_num = parseInt(response.data.value[1], 10);
          if (!isNaN(maybe_num)) {
            this.setState({ progress: maybe_num });
          }
        }
      }).catch(error => {
        let errMsg = `Trouble communicating with Redis due to error: ${error}`;
        this.showErrorMessage(errMsg);
      });
    }, interval);
  }

  getAllJobTypes() {
    axios({
      method: 'get',
      url: '/api/jobtypes'
    }).then((response) => {
      !this.isCancelled && this.setState({
        allJobTypes: response.data.jobTypes,
        jobType: response.data.jobTypes[0]
      });
    }).catch(error => {
      let errMsg = `Failed to get job types due to error: ${error}`;
      this.showErrorMessage(errMsg);
    });
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
        'jobType' : this.state.jobType,
        'dataRescale': this.state.rescalingDisabled === 'true' ? '' : this.state.rescaling
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
    if (!this.isCancelled) {
      this.setState({
        [event.target.name]: event.target.value
      });
      //if event is checkbox-animation related
      if(event.target.name === 'rescalingDisabled'){
        this.setState({
          [event.target.name]: event.target.checked.toString()
        });
      }
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
          className={classes.title}
          variant='h5'
          align='center'
          color='textPrimary'>
          Select Options | Upload your image | Download the results.
        </Typography>

        <Container maxWidth="md">
          <form autoComplete="off">
            <Grid container direction="row" justify="center" spacing={6}>

              {/* Job Options section */}
              <Grid item xs={12} sm={6} md={6}>
                <Paper className={classes.paper}>
                  <Grid container direction="column" justify="center">

                    {/* Job Type Dropdown */}
                    <Grid item xs={12} sm={12} md={6}>
                      <Typography onClick={this.handleOpen}>
                        Job Type
                      </Typography>
                      <FormControl>
                        <Select
                          open={this.state.setOpen}
                          onClose={this.handleClose}
                          onOpen={this.handleOpen}
                          onChange={this.handleChange}
                          value={this.state.jobType}
                          style={{textTransform: 'capitalize'}}
                          inputProps={{
                            name: 'jobType',
                            id: 'jobTypeValue',
                          }}
                        >
                          {this.state.allJobTypes.map(job => (
                            <MenuItem value={job} style={{textTransform: 'capitalize'}} key={this.state.allJobTypes.indexOf(job)}>
                              {job}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* Image Rescaling Options */}
                    <Grid item xs={12} sm={12} md={6} className={classes.paddedTop}>
                      <FormGroup row>
                        <FormControl>

                          <FormControlLabel
                            control={
                              <Checkbox checked={this.state.rescalingDisabled === 'true'}
                                onChange={this.handleChange}
                                value={this.state.rescalingDisabled}
                                inputProps={{
                                  name: 'rescalingDisabled'
                                }}
                              />
                            }
                            label="Rescale Automatically"
                          />

                          <TextField
                            id="outlined-number"
                            label="Rescaling Value"
                            disabled={this.state.rescalingDisabled === 'true'}
                            value={this.state.rescaling}
                            onChange={this.handleChange}
                            type="number"
                            margin="dense"
                            variant="standard"
                            inputProps={{
                              name: 'rescaling',
                              id: 'rescalingValue',
                            }}
                          />
                        </FormControl>
                      </FormGroup>
                    </Grid>

                  </Grid>
                </Paper>
              </Grid>

              {/* File Upload section */}
              <Grid item xs={12} sm={6} md={6}>
                <Paper className={classes.paper}>
                  <FileUpload
                    infoText='Upload Here to Begin Image Prediction.'
                    onDroppedFile={(uploadedName, fileName, url) =>
                      this.setState({
                        uploadedFileName: uploadedName,
                        fileName: fileName,
                        imageUrl: url
                      })} />
                </Paper>
              </Grid>

            </Grid>

            {/* Display error to user */}
            { this.state.showError &&
              <Typography
                className={classes.paddedTop}
                variant='body2'
                style={{whiteSpace: 'pre-line'}}
                align='center'
                color='error'>
                {this.state.errorText}
              </Typography> }

            {/* Submit button */}
            { !this.state.submitted &&
              <Grid id='submitButtonWrapper' item lg className={classes.paddedTop}>
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
              </Grid> }

            {/* Progress bar for submitted jobs */}
            { this.state.submitted && !this.state.showError && this.state.downloadURL === null ?
              this.state.progress === 0 || this.state.progress === null ?
                <Grid item lg className={classes.paddedTop}>
                  <LinearProgress
                    variant="buffer"
                    value={0}
                    valueBuffer={0}
                    className={classes.progress}
                  />
                </Grid>
                :
                <Grid item lg className={classes.paddedTop}>
                  <LinearProgress
                    variant="determinate"
                    value={this.state.progress}
                    className={classes.progress}
                  />
                </Grid>
              : null }

            {/* Download results and Retry buttons */}
            { this.state.downloadURL !== null &&
              <div>
                <Grid item lg className={classes.paddedTop}>
                  <Button
                    href={this.state.downloadURL}
                    variant='contained'
                    size='large'
                    fullWidth
                    color='secondary'>
                    Download Results
                  </Button>
                </Grid>

                <Grid item lg className={classes.paddedTop}>
                  <Button
                    href='/predict'
                    variant='contained'
                    size='large'
                    fullWidth
                    color='primary'>
                    Submit New Image
                  </Button>
                </Grid>
              </div> }

          </form>
        </Container>
      </div>
    );
  }
}

Predict.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Predict);
