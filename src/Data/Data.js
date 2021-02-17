import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import DataCard from './DataCard.js';

// Styles Object for MaterialUI styling
const useStyles = makeStyles(theme => ({
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
}));

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

export default function Data() {

  const [value, setValue] = useState('prediction');

  const classes = useStyles();

  return (
    <div>
      {/* Start Top Banner Area */}
      <div className={classes.heroUnit}>
        <div className={classes.heroContent}>
          <Typography variant="h2" align="center" color="textPrimary" gutterBottom>
            Example Image Data
          </Typography>
          <Typography variant="h5" align="center" color="textSecondary" paragraph>
            Here are some images that you can download and submit to the models
            to see how deepcell works!
          </Typography>
        </div>
      </div>
      {/* Top Banner Area - END */}

      {/* Start MaterialUI Tabs/tab appbar */}
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={(e, v) => setValue(v)}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab value="prediction" label="Prediction Data" />
          <Tab value="training" label="Training Data" />
        </Tabs>
      </AppBar>

      {/* Example Cards */}
      {value === 'prediction' && <TabContainer >
        <DataCard cardType={value} />
      </TabContainer>}

      {/* Training Cards */}
      {value === 'training' && <TabContainer >
        <DataCard cardType={value} />
      </TabContainer>}
      {/* END MaterialUI Tabs/tab appbar */}
    </div>
  );
}
