import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import FileUpload from '../FileUpload/FileUpload';
import './Predict.css';

const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 2,
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
});

class Predict extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      models: '',
      model: '',
      version: '',
      fileName: '',
      imageURL: '',
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
        console.log(`Got Models: ${JSON.stringify(response.data.models, null, 4)}`);
      })
      .catch((error) => {
        this.setState({
          showError: true,
          errorText: 'Could not fetch models from the cloud bucket.'
        });
        console.log(`Error calling /api/getModels: ${error}`);
      });
  }

  predict() {
    // temporary workaround to allow slicing of images
    let cuts = this.state.model === 'mousebrain' ? 8 : 0;
    axios({
      method: 'post',
      url: '/api/predict',
      timeout: 60 * 4 * 1000, // 4 minutes
      data: {
        'imageName': this.state.fileName,
        'imageURL': this.state.imageURL,
        'model_name': this.state.model,
        'model_version': this.state.version,
        'cuts': cuts
      }
    })
      .then((response) => {
        let redisHash = response.data.hash;
        this.statusCheck = setInterval(() => {
          axios({
            method: 'post',
            url: '/api/redis',
            data: {
              'hash': redisHash,
              'key': 'output_url'
            }
          })
            .then((response) => {
              if (response.data.value.slice(0, 8) === 'https://') {
                clearInterval(this.statusCheck);
                this.setState({
                  downloadURL: response.data.value
                });
              } else if (response.data.value.slice(0, 5) === 'fail') {
                clearInterval(this.statusCheck);
                this.setState({
                  showError: true,
                  errorText: `Got a failure code = "${response.data.value}".`
                });
              }
            })
            .catch(error => {
              this.setState({
                showError: true,
                errorText: 'Trouble communicating with redis.'
              });
              console.log(`Error occurred while getting redis status: ${error}`);
            });
        }, 3000);
      })
      .catch(error => {
        this.setState({
          showError: true,
          errorText: 'Could not get results from tensorflow-serving.'
        });
        console.log(`Error occurred while submitting prediction job: ${error}`);
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
    this.predict();
  }

  handleChange(event) {
    !this.isCancelled && this.setState({
      [event.target.name]: event.target.value
    });
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
          Select a model and version | Upload your image | Download the results.
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
                      { Object.keys(this.state.models).map(m =>
                        <MenuItem value={m} key={m}>{m}</MenuItem>) }
                    </Select>
                  </FormControl>
                  : null }
              </Grid>

              <Grid item xs>
                { this.state.model.length > 0 ?
                  <FormControl className={classes.formControl}>
                    <FormLabel>Select A Version</FormLabel>
                    <Select
                      value={this.state.version}
                      input={<Input name='version' id='version-placeholder' placeholder='' />}
                      onChange={this.handleChange}>
                      { this.state.models[this.state.model].map(v =>
                        <MenuItem value={v} key={v}>{v}</MenuItem>) }
                    </Select>
                  </FormControl>
                  : null }
              </Grid>

            </Paper>

            <Grid item xs className='uploader'>
              <FileUpload onDroppedFile={(fileName, url) =>
                this.setState({ fileName: fileName, imageURL: url }) } />
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
              <Grid item lg style={{'paddingTop': '1em'}}>
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

            { this.state.submitted && !this.state.showError && this.state.downloadURL === null  ?
              <Grid item lg style={{'paddingTop': '2em'}}>
                <LinearProgress className={classes.progress} />
              </Grid>
              : null }

            { this.state.downloadURL !== null ?
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
