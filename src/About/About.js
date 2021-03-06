import React from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
// import AboutImage from '.VirtuousCycle.svg';
import AboutImage from './VirtuousCycle.png';

const useStyles = makeStyles(theme => ({
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
  img: {
    maxWidth: '100%'
  }
}));

export default function About() {

  const classes = useStyles();

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
            <Container  maxWidth="sm">
              {/* <AboutImage /> */}
              <img className={classes.img} src={AboutImage}/>
            </Container>
          </Paper>
        </Grid>

      </Grid>
      {/* SVG Image - END */}

      <Typography variant="h5" align="center" color="textSecondary" className={classes.heroContent}>
        DeepCell is a collection of machine learning resources that facilitate the development and application of new deep learning methods to biology by addressing 3 needs:
        (1) Data Annotation and Management, (2) Model Development, and (3) Deployment and Inference
      </Typography>

      <Grid container alignItems="stretch" justify="space-evenly">

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
              <Typography className={classes.heading}>DeepCell Label</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                <Link href="https://github.com/vanvalenlab/deepcell-label" target="_blank" rel="noreferrer">DeepCell Label</Link> is our training data curation tool.
                It provides an inutitive UI for users to create annotations from scratch or to correct model predictions, to faciliate the creation of large, high-quality datasets.
                DeepCell Label can be deployed locally or on the cloud.
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
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                <Link href="https://github.com/vanvalenlab/deepcell-tf" target="_blank" rel="noreferrer">deepcell-tf</Link> is our core deep learning library.
                Based on TensorFlow, it contains a suite of tools for building and training deep learning models.
                The library has been constructed in a modular fashion to make it easy to mix and match different model architectures, prediction tasks, and post-processing functions.
                For more information, check out the <Link href="https://deepcell.readthedocs.io/en/master/" target="_blank" rel="noreferrer">documentation</Link>.
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
              aria-controls="panel-deployment-3-content"
              id="panel-deployment-3-header"
            >
              <Typography className={classes.heading}>kiosk-console</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography component={'span'}>
                The <Link href="https://github.com/vanvalenlab/kiosk-console" target="_blank" rel="noreferrer">kiosk-console</Link> is a turn-key cloud-based solution for deploying a scalable inference platform.
                The platform includes a <Link href="/predict">simple drag-and-drop interface</Link> for segmenting a few images, and a <Link href="https://github.com/vanvalenlab/kiosk-client" target="_blank" rel="noreferrer">robust API</Link> capable of affordably processing millions of images.
                <br /><br />
                We use this platform to host DeepCell.org and <Link href="https://github.com/vanvalenlab/intro-to-deepcell/tree/master/pretrained_models#formatting-data-for-pre-trained-models" target="_blank" rel="noopener noreferrer"> currently deployed models</Link>.
                However, it is built with extensibility in mind, and it is easy to deploy your own models.

                To learn more about deploying your own instance of DeepCell.org using the kiosk-console, <Link href="https://deepcell-kiosk.readthedocs.io/" target="_blank" rel="noreferrer">read the docs</Link>.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel-deployment-3-content"
              id="panel-deployment-3-header"
            >
              <Typography className={classes.heading}>kiosk-imagej-plugin</Typography>
              {/* <Typography className={classes.secondaryHeading}>I am an accordion</Typography> */}
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                The <Link href="https://github.com/vanvalenlab/kiosk-imagej-plugin" target="_blank" rel="noreferrer">kiosk-imagej-plugin</Link> enables ImageJ to segment images with a deployed DeepCell Kiosk model without leaving the application.
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
                <Link href="https://github.com/vanvalenlab/deepcell-applications" target="_blank" rel="noreferrer">deepcell-applications</Link> contains a variety of trained deep learning models and post-processing functions for instance segmentation.
                Each model can be imported and run locally from a Docker image, Jupyter notebook, or custom script.
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
                The <Link href="https://github.com/angelolab/ark-analysis" target="_blank" rel="noreferrer">ark repository</Link> is our integrated multiplex image analysis pipeline.
                The input is multiplexed image data from any platform.
                It segments the data with <Link href="https://github.com/vanvalenlab/intro-to-deepcell/tree/master/pretrained_models#mesmer-segmentation-model" target="_blank" rel="noopener noreferrer">Mesmer</Link> using the <Link href="https://deepcell-kiosk.readthedocs.io" target="_blank" rel="noopener noreferrer">Kiosk</Link>, extracts the counts of each marker in each cell, normalizes the data, and then creates a summary table with morphological information and marker intensity for every cell in each image.
                It also provides an easy way to run some standard spatial analysis functions on your data.
              </Typography>
            </AccordionDetails>
          </Accordion>

        </Grid>

      </Grid>

    </div>
  );
}
