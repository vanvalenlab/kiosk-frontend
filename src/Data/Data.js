import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import DataCard from '../DataCard/DataCard.js';

// Styles Object for MaterialUI styling
const styles = theme => ({
  heroUnit: {
    backgroundColor: theme.palette.background.paper,
  },
  heroContent: {
    maxWidth: 600,
    margin: '0 auto',
    padding: `${theme.spacing(8)}px 0 ${theme.spacing(6)}px`,
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    [theme.breakpoints.up(1100 + theme.spacing(3) * 2)]: {
      width: 1100,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  cardGrid: {
    padding: `${theme.spacing(8)}px 0`,
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  }
});

// This function is described before the Class declaration for the Data component, below.
function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

// propType description for React to check data type when TabContainer jsx instances are given prop's.
TabContainer.propTypes = {
  children: PropTypes.node.isRequired
};

// !!!!!!!!!!!Class Declaration for Data Component !!!!!!!!!!!!!!!!!!!!!!!!!!!!!
class Data extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value:'prediction',
    };
    // Binding the function's name call to the "this" key word for this Class
    // object, rather than the function HandleChange.
    // refer to: https://stackoverflow.com/questions/32317154/react-uncaught-typeerror-cannot-read-property-setstate-of-undefined
    this.handleChange = this.handleChange.bind(this);
  }

  // Function to set the index of the <Tab> child being parametized.
  // (https://material-ui.com/api/tabs/)
  handleChange(event,value){
    this.setState({ value: value });
  }

  render() {
    const { classes } = this.props;

    return(
      // Outermost Div
      <div>
        {/* Start Top Banner Area */}
        <div className={classes.heroUnit}>
          <div className={classes.heroContent}>
            <Typography variant="display3" align="center" color="textPrimary" gutterBottom>
              Example Image Data
            </Typography>
            <Typography variant="title" align="center" color="textSecondary" paragraph>
              Here are some images that you can download and submit to the models
              to see how deepcell works!
            </Typography>
          </div>
        </div>
        {/* Top Banner Area - END */}

        {/* Start MaterialUI Tabs/tab appbar */}
        <AppBar position="static" color="default">
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab value="prediction" label="Prediction Data" />
            <Tab value="training" label="Training Data" />
          </Tabs>
        </AppBar>

        {/* Example Cards */}
        {this.state.value === 'prediction' && <TabContainer >
          <DataCard cardType={this.state.value} ></DataCard>
        </TabContainer>}

        {/* Training Cards */}
        {this.state.value === 'training' && <TabContainer >
          <DataCard cardType={this.state.value} ></DataCard>
        </TabContainer>}
        {/* END MaterialUI Tabs/tab appbar */}
      </div>
      //END Outermost Div
    );
  }
}

Data.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Data);
