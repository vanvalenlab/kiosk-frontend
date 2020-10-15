import React from 'react';
import PropTypes from 'prop-types';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AboutImage from '../../public/images/VirtuousCycle.svg';

const styles = theme => ({
  root: {
    flexGrow: 1,
    margin: theme.spacing(4)
  },
  heroUnit: {
    backgroundColor: theme.palette.background.paper,
  },
  heroContent: {
    maxWidth: 800,
    margin: '0 auto',
    padding: `${theme.spacing(8)}px 0 ${theme.spacing(6)}px`,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  sectionHeader: {
    // margin: theme.spacing(4),
    padding: theme.spacing(2),
    textAlign: 'center',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
});

class About extends React.Component {

  render() {
    const { classes } = this.props;

    return(
      <div className={classes.root}>
        {/* Start Top Banner Area */}
        <Typography variant="h2" align="center" color="textPrimary" gutterBottom>
          What is DeepCell?
        </Typography>
        {/* Top Banner Area - END */}

        {/* Start SVG Image */}
        <Grid
          container
          direction="column"
          alignItems="center"
          justify="center"
        >

          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <AboutImage />
            </Paper>
          </Grid>
        
        </Grid>
        {/* SVG Image - END */}

        <Typography variant="h5" align="center" color="textSecondary" className={classes.heroContent}>
          DeepCell is a collection of machine learning resources that facilitate the development and application of new deep learning methods to biology by addressing 3 needs:
          (1) Data Annotation and Management, (2) Model Development, and (3) Deployment and Inference
        </Typography>

        <Grid
          container
          alignItems="stretch"
          justify="space-evenly"
        >

          <Grid item xs={10}>
            <Typography variant="h4" className={classes.sectionHeader}>
              Data Annotation and Management
            </Typography>

            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel-data-1-content"
                id="panel-data-1-header"
              >
                <Typography className={classes.heading}>caliban</Typography>
                {/* <Typography className={classes.secondaryHeading}>I am an accordion</Typography> */}
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Caliban is our tool curating training data.
                  It provides an inutitive GUI for users to create annotations from scratch, or to correct model predictions, to faciliate the creation of large, high-quality datasets.
                  Caliban can be deployed locally, or to the cloud. The <a href="https://github.com/vanvalenlab/caliban/blob/master/README.md">README</a> has more instructions for how to get started.
                </Typography>
              </AccordionDetails>
            </Accordion>

          </Grid>

          <Grid item xs={10}>
            <Typography variant="h4" className={classes.sectionHeader}>
              Model Development
            </Typography>

            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel-model-dev-1-content"
                id="panel-model-dev-1-header"
              >
                <Typography className={classes.heading}>deepcell-tf</Typography>
                {/* <Typography className={classes.secondaryHeading}>I am an accordion</Typography> */}
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  This is the core deepcell library.
                  DeepCell-tf contains the necessary functions to train new deep learning models.
                  The library has been constructed in a modular fashion to make it easy to mix and match different model architectures, prediction tasks, and post-processing functions.
                  The <a href="https://github.com/vanvalenlab/deepcell-tf/blob/master/README.md">README</a> has instructions for getting started.
                  For more information, check out the <a href="https://deepcell.readthedocs.io/en/master/">documentation</a>.
                </Typography>
              </AccordionDetails>
            </Accordion>

          </Grid>

          <Grid item xs={10}>
            <Typography variant="h4" className={classes.sectionHeader}>
              Deployment & Inference
            </Typography>

            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel-deployment-1-content"
                id="panel-deployment-1-header"
              >
                <Typography className={classes.heading}>deepcell.org</Typography>
                {/* <Typography className={classes.secondaryHeading}>I am an accordion</Typography> */}
              </AccordionSummary>
              <AccordionDetails>
                <Typography component={'span'}>
                  The deepcell.org websites provides a web interface to access trained deep learning models.
                  With an easy drag-and-drop interface, it has the lowest barrier to entry for getting high-quality predictions back from a variety of deep learning models.
                  All predictions are made using our cloud-based deployment, meaning no local installation is required.
                  Image data can be uploaded <a href="https://deepcell.org/predict">here</a>.
                  <br /><br />
                  Currently, there are three distinct model types.
                  <ol>
                    <li>Segmentation: This is our nuclear prediction model for cell culture. The input to this model is a single nuclear image. The output of this model is a mask with the nuclear segmentation of each cell in the image.</li>
                    <li>Tracking: This our live-cell tracking model. The input to this model is a time-lapse movie of a single nuclear channel. The output of this model is a segmentation mask for each frame in the time-lapse movie, with the cell ids linked across images such that the same cell always has the same label.</li>
                    <li>Multiplex: This is our multiplex imaging model. The input to this model is a 2-channel image consisting of a nuclear channel and a membrane or cytoplasm channel. The output of this model is a mask with the cell-segmentation of each cell in the image.</li>
                  </ol>
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel-deployment-2-content"
                id="panel-deployment-2-header"
              >
                <Typography className={classes.heading}>deepcell-applications</Typography>
                {/* <Typography className={classes.secondaryHeading}>I am an accordion</Typography> */}
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  The applications repository contains a variety of trained deep learning models.
                  This repository allows you to run trained deep learning models.
                  It does not provide a cloud-based environment to run these models.
                  Instead, there are jupyter notebooks and docker images for users who want more fine-grained control over the parameters of the model, or who need a local deployment.
                  The <a href="https://github.com/vanvalenlab/deepcell-applications/blob/master/README.md">README</a> has more instructions for how to get started.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel-deployment-3-content"
                id="panel-deployment-3-header"
              >
                <Typography className={classes.heading}>kiosk-console</Typography>
                {/* <Typography className={classes.secondaryHeading}>I am an accordion</Typography> */}
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  The kiosk console allows users to spin up their own cloud-based deployment of pretrained models.
                  It automatically handles resource management and scaling to  quickly generate high-quality deep learning predictions.
                  The <a href="https://github.com/vanvalenlab/kiosk-console/blob/master/README.md">README</a> has more instructions for how to get started.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel-deployment-4-content"
                id="panel-deployment-4-header"
              >
                <Typography className={classes.heading}>ark-analysis</Typography>
                {/* <Typography className={classes.secondaryHeading}>I am an accordion</Typography> */}
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                The ark repository is our integrated multiplex image analysis pipeline.
                The input is multiplexed image data from any platform.
                It runs the data through deepcell, extracts the counts of each marker in each cell, normalizes the data, and then creates a summary table with morphological information and marker intensity for every cell in each image.
                It also provides an easy way to run some standard spatial analysis functions on your data.
                The <a href="https://github.com/angelolab/ark-analysis/blob/master/README.md">README</a> has more instructions for how to get started.
                </Typography>
              </AccordionDetails>
            </Accordion>

          </Grid>

        </Grid>

      </div>
    );
  }
}

About.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(About);
