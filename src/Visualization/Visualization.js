import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import './Visualization.css';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  paper: {
    padding: theme.spacing.unit * 10,
    textAlign: 'center',
    verticanAlign: 'top',
    color: theme.palette.text.secondary,
  },
});

class Visualization extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Grid container alignItems="flex-start" spacing={40} justify='flex-start' direction="row">
          <Grid item>
            <Paper className={classes.paper}>
              <Typography
                variant='title'
                align='center'
                color='textSecondary'
                paragraph
                style={{}}>
                Image Visualization
              </Typography>
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