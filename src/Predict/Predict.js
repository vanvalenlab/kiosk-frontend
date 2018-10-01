import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
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
  }
});

class Predict extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      models: '',
      model: '',
      version: '',
      downloadURL: null
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.retrieveModelsVersions();
  }

  componentWillUnmount() {
    this.isCancelled = true;
  }

  retrieveModelsVersions() {
    axios.get('/api/getModels')
      .then((response) => {
        !this.isCancelled && this.setState({
          models: response.data.models
        });
        console.log(`Got Models: ${JSON.stringify(response.data.models, null, 4)}`);
      })
      .catch((error) => {
        console.log(`Error calling /api/getModels: ${error}`);
      });
  }

  //SEND UPLOADED IMAGE NAME TO REDIS FOR PREDICTION
  predictImage(fileName, s3Url) {
    let payload = {
      'imageName': fileName,
      'imageURL': s3Url,
      'model_name': this.state.model,
      'model_version': this.state.version
    };
    console.log(JSON.stringify(payload, null, 4));

    axios({
      method: 'post',
      url: '/api/predict',
      timeout: 60 * 4 * 1000, // 4 minutes
      data: payload
    })
      .then((response) => {
        console.log(JSON.stringify(response.data, null, 4));
        this.setState({
          downloadURL: response.data.outputURL
        });
      })
      .catch(error => {
        console.log(`Error occurred while sending S3 Bucket URL to Express Server: ${error}`);
      });
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
          variant="title"
          align="center"
          color="textSecondary"
          paragraph
          style={{'paddingBottom': '1em'}}>
          Select a model and version | Upload your image | Download the results.
        </Typography>
        <Grid container spacing={40} justify='space-evenly'>
          <form autoComplete='off'>

            <Paper className="selection">
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

            <Grid item xs className="uploader">
              <div>
                <FileUpload onDroppedFile={(fileName, s3Url) =>
                  this.predictImage(fileName, s3Url)} />
              </div>
            </Grid>

            { this.state.downloadURL !== null ?
              <Grid item lg style={{'padding-top': '2em'}}>
                <Button
                  href={this.state.downloadURL}
                  variant="contained"
                  size="large"
                  fullWidth
                  color="primary">
                  Download Results
                </Button>
              </Grid>
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
