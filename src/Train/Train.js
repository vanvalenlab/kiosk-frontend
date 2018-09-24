import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Slider from '@material-ui/lab/Slider';
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
});

class Train extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      optimizer: '',
      field: 61
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSliderChange = this.handleSliderChange.bind(this);
  }

  componentWillUnmount() {
    this.isCancelled = true;
  }

  //SEND UPLOADED IMAGE NAME TO REDIS FOR PREDICTION
  train() {
    let payload = this.state;

    axios({
      method: 'post',
      url: '/api/train',
      timeout: 60 * 4 * 1000, // 4 minutes
      data: payload
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

  handleChange(event) {
    !this.isCancelled && this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleSliderChange(event, value) {
    !this.isCancelled && this.setState({
      field: value
    });
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Grid container spacing={40} justify='space-evenly'>
          <form autoComplete='off' className={classes.form}>

            <Paper className="selection">
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
                <FormLabel>Receptive Field Size:</FormLabel>
                <Typography id='slider-label'>{this.state.field}</Typography>
                <Slider
                  value={this.state.field}
                  aria-labelledby='slider-label'
                  min={1}
                  max={101}
                  step={1}
                  onChange={this.handleSliderChange} />
              </Grid>
            </Paper>

            <Grid item xs>
              <FileUpload onDroppedFile={(fileName, s3Url) =>
                this.train(fileName, s3Url)} />
            </Grid>

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
