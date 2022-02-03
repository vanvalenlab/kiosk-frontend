import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { styled } from '@mui/system';
import DataCard from './DataCard.js';

const Div = styled('div')``;

// This function is described before the Class declaration for the Data component, below.
function TabContainer(props) {
  return (
    <Typography component="div" sx={{ padding: 8 * 3 }}>
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

  return (
    <div>
      {/* Start Top Banner Area */}
      <Div sx={{ backgroundColor: 'background.paper' }}>
        <Div sx={{ maxWidth: 600, m: '0 auto', p:  (theme) => `${theme.spacing(8)} 0 ${theme.spacing(6)}` }}>
          <Typography variant="h2" align="center" color="textPrimary" gutterBottom>
            Example Image Data
          </Typography>
          <Typography variant="h5" align="center" color="textSecondary" paragraph>
            Here are some images that you can download and submit to the models
            to see how deepcell works!
          </Typography>
        </Div>
      </Div>
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
