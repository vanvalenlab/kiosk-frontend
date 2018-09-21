import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import axios from 'axios';
import FileUpload from '../FileUpload/FileUpload';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import FormLabel from '@material-ui/core/FormLabel';
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
        !this.isCancelled && this.setState({
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
