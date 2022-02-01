import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { PropTypes } from 'prop-types';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import DataCard from './DataCard.js';

const PREFIX = 'Data';

const classes = {
  heroUnit: `${PREFIX}-heroUnit`,
  heroContent: `${PREFIX}-heroContent`,
  heroButtons: `${PREFIX}-heroButtons`,
  layout: `${PREFIX}-layout`,
  cardGrid: `${PREFIX}-cardGrid`,
  card: `${PREFIX}-card`,
  cardMedia: `${PREFIX}-cardMedia`,
  cardContent: `${PREFIX}-cardContent`
};

const Root = styled('div')((
  {
    theme
  }
) => ({
  [`& .${classes.heroUnit}`]: {
    backgroundColor: theme.palette.background.paper,
  },

  [`& .${classes.heroContent}`]: {
    maxWidth: 600,
    m: '0 auto',
    p: `${theme.spacing(8)} 0 ${theme.spacing(6)}`,
  },

  [`& .${classes.heroButtons}`]: {
    mt: 4,
  },

  [`& .${classes.layout}`]: {
    width: 'auto',
    mx: 3,
    [theme.breakpoints.up(1100 + theme.spacing(3) * 2)]: {
      width: 1100,
      mx: 'auto',
    },
  },

  [`& .${classes.cardGrid}`]: {
    p: `${theme.spacing(8)} 0`,
  },

  [`& .${classes.card}`]: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },

  [`& .${classes.cardMedia}`]: {
    pt: '56.25%', // 16:9
  },

  [`& .${classes.cardContent}`]: {
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



  return (
    <Root>
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
    </Root>
  );
}
