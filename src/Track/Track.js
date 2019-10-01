import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import LinearProgress from '@material-ui/core/LinearProgress';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import FileUpload from '../FileUpload/FileUpload';
import './Track.css';

const styles = theme => ({
  root: {
    flexGrow: 1,
    margin: theme.spacing(4),
    paddingTop: theme.spacing(2)
  },
  form: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  progress: {
    margin: theme.spacing(2),
  },
});

class Track extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      models: [],
      model: '',
      version: '',
      fileName: '',
      imageURL: '',
      progress: 0,
      downloadURL: null,
      submitted: false,
      showError: false,
      errorText: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.canBeSubmitted = this.canBeSubmitted.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.retrieveModelsVersions();
  }

  componentWillUnmount() {
    this.isCancelled = true;
  }

  retrieveModelsVersions() {
    axios.get('/api/models')
      .then((response) => {
        !this.isCancelled && this.setState({
          models: response.data.models
        });
      })
      .catch((error) => {
        let errMsg = `Could not fetch models from the cloud bucket due to error: ${error}`;
        this.showErrorMessage(errMsg);
      });
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
        url: '/api/redis',
        data: {
          'hash': redisHash,
          'key': 'status'
        }
      }).then((response) => {
        if (response.data.value === 'failed') {
          clearInterval(this.statusCheck);
          this.getErrorReason(redisHash);
          this.expireRedisHash(redisHash, 3600);
        } else if (response.data.value === 'done') {
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
        } else {
          axios({
            method: 'post',
            url: '/api/redis',
            data: {
              'hash': redisHash,
              'key': 'progress'
            }
          }).then((response) => {
            let maybe_num = parseInt(response.data.value, 10);

            if (!isNaN(maybe_num)) {
              this.setState({
                progress: maybe_num
              })
            }
          })
        }
      }).catch(error => {
        let errMsg = `Trouble communicating with Redis due to error: ${error}`;
        this.showErrorMessage(errMsg);
      });
    }, interval);
  }

  track() {
    axios({
      method: 'post',
      url: '/api/track',
      timeout: 60 * 4 * 1000, // 4 minutes
      data: {
        'imageName': this.state.fileName,
        'uploadedName': this.state.uploadedFileName,
        'imageURL': this.state.imageURL,
        'model_name': this.state.model,
        'model_version': this.state.version,
      }
    }).then((response) => {
      this.checkJobStatus(response.data.hash, 3000);
    }).catch(error => {
      let errMsg = `Could not get results from tensorflow-serving due to error: ${error}.`;
      this.showErrorMessage(errMsg);
    });
  }

  canBeSubmitted() {
    return (
      this.state.fileName.length > 0 &&
      this.state.imageURL.length > 0 &&
      this.state.model.length > 0 &&
      this.state.version.length > 0
    );
  }

  handleSubmit(event) {
    if (!this.canBeSubmitted()) {
      event.preventDefault();
      return;
    }
    this.setState({ submitted: true });
    this.track();
  }

  preselectModelConfig(event) {
    this.setState({
      version: this.state.models[event.target.value][0]
    });
  }

  handleChange(event) {
    !this.isCancelled && this.setState({
      [event.target.name]: event.target.value
    });
    // if updating a model, default to the first version
    if (event.target.name === 'model') {
      this.preselectModelConfig(event);
    }
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
          style={{'paddingBottom': '1em'}}>
          Select a model and version | Upload your images | Download the results.
        </Typography>

        <Grid container spacing={40} justify='space-evenly'>
          <form autoComplete='off'>

            <Paper className='selection'>
              <Grid item xs>
                { this.state.models !== null ?
                  <FormControl className={classes.formControl}>
                    <FormLabel>Select A Model</FormLabel>
                    <Select
                      value={this.state.model}
                      input={<Input name='model' id='model-placeholder' placeholder='' />}
                      onChange={this.handleChange}
                      displayEmpty
                      className={classes.selectEmpty}>
                      <MenuItem value=''>
                        <em>None</em>
                      </MenuItem>
                      { Object.keys(this.state.models).sort().map(m =>
                        <MenuItem value={m} key={m}>{m}</MenuItem>) }
                    </Select>
                  </FormControl>
                  : null }
              </Grid>

              <Grid item xs>
                <FormControl className={classes.formControl}>
                  <FormLabel>Select A Version</FormLabel>
                  <Select
                    value={this.state.version}
                    disabled={this.state.model === ''}
                    input={<Input name='version' id='version-placeholder' placeholder='' />}
                    onChange={this.handleChange}>
                    { this.state.model && this.state.models[this.state.model].map(v =>
                      <MenuItem value={v} key={v}>{v}</MenuItem>) }
                  </Select>
                </FormControl>
              </Grid>
            </Paper>

            <Grid item xs className='uploader'>
              <FileUpload
                infoText='Upload Here to Begin Cell Tracking.'
                onDroppedFile={(uploadedName, fileName, url) =>
                  this.setState({
                    uploadedFileName: uploadedName,
                    fileName: fileName,
                    imageURL: url }) } />
            </Grid>

            { this.state.showError &&
              <Typography
                variant='subheading'
                align='center'
                color='error'
                paragraph
                style={{'paddingTop': '1em'}}>
                {this.state.errorText}
              </Typography> }

            { !this.state.submitted &&
              <Grid id='submitButtonWrapper' item lg style={{'paddingTop': '1em'}}>
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

            { this.state.submitted && !this.state.showError && this.state.downloadURL === null ?
              this.state.progress === 0 || this.state.progress === null ?
                <Grid item lg style={{'paddingTop': '2em'}}>
                  <LinearProgress
                    variant="buffer"
                    value={0}
                    valueBuffer={0}
                    className={classes.progress}
                  />
                </Grid>
                :
                <Grid item lg style={{'paddingTop': '2em'}}>
                  <LinearProgress
                    variant="determinate"
                    value={this.state.progress}
                    className={classes.progress}
                  />
                </Grid>
              : null }

            { this.state.downloadURL !== null &&
              <div>
                <Grid item lg style={{'paddingTop': '2em'}}>
                  <Button
                    href={this.state.downloadURL}
                    variant='contained'
                    size='large'
                    fullWidth
                    color='secondary'>
                    Download Results
                  </Button>
                </Grid>

                <Grid item lg style={{'paddingTop': '2em'}}>
                  <Button
                    href='/track'
                    variant='contained'
                    size='large'
                    fullWidth
                    color='primary'>
                    Submit New Image
                  </Button>
                </Grid>
              </div> }

          </form>
        </Grid>
      </div>
    );
  }
}

Track.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Track);
