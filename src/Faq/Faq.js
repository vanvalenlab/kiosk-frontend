import React from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  title: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
    margin: theme.spacing(2),
  }
}));

export default function Faq() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="h2" align="center" color="textPrimary" gutterBottom className={classes.title}>
        Frequently Asked Questions
      </Typography>

      <Container maxWidth="md">
        <Grid container spacing={3}>
          <Grid item xs={12}>

            <Paper className={classes.paper}>
              <Typography variant="h5" align="left" color="textPrimary" gutterBottom>
                How do I get started using DeepCell?
              </Typography>
              <Typography variant="body1" align="left" color="textPrimary" gutterBottom>
                You can use the Predict tab to upload image files (.tiff, .png, .jpg, etc.) and segment them with our pre-trained models.

                Additionally, you can deploy your own DeepCell Kiosk by following the instructions on the <Link href="https://deepcell-kiosk.readthedocs.io/en/master/" target="_blank" rel="noopener noreferrer">Kiosk Documentation</Link>.
              </Typography>
              <Typography variant="body1" align="left" color="textPrimary" gutterBottom>
                The deployment comes with pre-trained models for a few common image processing tasks, including nuclear segmentation for 2D images and nuclear tracking for 3D tiff stacks.

                These models are hosted with <Link href="https://github.com/tensorflow/serving" target="_blank" rel="noopener noreferrer">TensorFlow Serving</Link> and are running on auto-scaling GPUs to minimize cost.

                The servable model files can be found in our <Link href="https://console.cloud.google.com/storage/browser/deepcell-models" target="_blank" rel="noopener noreferrer">public bucket</Link>.
              </Typography>
            </Paper>

            <Paper className={classes.paper}>
              <Typography variant="h5" align="left" color="textPrimary" gutterBottom>
                What does this error message mean?
              </Typography>
              <ul>
                <li>
                  <Typography variant="subtitle1" align="left" color="error" gutterBottom>
                    Invalid image shape
                  </Typography>
                  <Typography variant="body2" align="left" color="textPrimary" gutterBottom>
                    The image provided is not compatible with the model.

                    Check that the channels of the input image match the expected model output, and that the dimensions of the image match the model (i.e. 2D images or 3D movies).
                  </Typography>
                </li>

                <li>
                  <Typography variant="subtitle1" align="left" color="error" gutterBottom>
                    Input only has X channels but channel Y was declared as an input channel.
                  </Typography>
                  <Typography variant="body2" align="left" color="textPrimary" gutterBottom>
                    An RGB channel was specified but is out of range for the input image.
                  </Typography>
                </li>

                <li>
                  <Typography variant="subtitle1" align="left" color="error" gutterBottom>
                    Input image is larger than the maximum supported image size of (M, N).
                  </Typography>
                  <Typography variant="body2" align="left" color="textPrimary" gutterBottom>
                    Your input image is too big! Try cropping the image and uploading the crops separately.
                  </Typography>
                </li>
              </ul>
            </Paper>

            <Paper className={classes.paper}>
              <Typography variant="h5" align="left" color="textPrimary" gutterBottom>
                Can I add my own models?
              </Typography>
              <Typography variant="body1" align="left" color="textPrimary" gutterBottom>
                Yes! deepcell.org is an instance of the <Link href='https://github.com/vanvalenlab/kiosk-console' target='_blank' rel='noopener noreferrer'>kiosk-console</Link> which is fully extensible and serves models from a cloud bucket using <Link href='https://www.tensorflow.org/tfx/guide/serving' target='_blank' rel='noopener noreferrer'>TensorFlow Serving</Link>.
              </Typography>
              <Typography variant="body1" align="left" color="textPrimary" gutterBottom>
                For more information on creating and customizing your own instance of the kiosk-console, please check out <Link href='https://deepcell-kiosk.readthedocs.io/' target='_blank' rel='noopener noreferrer'>its docs</Link>.
              </Typography>
            </Paper>

            <Paper className={classes.paper}>
              <Typography variant="h5" align="left" color="textPrimary" gutterBottom>
                Can you help me annotate my data?
              </Typography>
              <Typography variant="body1" align="left" color="textPrimary" gutterBottom>
                Yes! Our training data was created using <Link href="https://github.com/vanvalenlab/deepcell-label" target="_blank" rel="noopener noreferrer">DeepCell Label</Link>, a tool for creating segmentation masks for images.
                DeepCell Label is an open-source web application that can integrate with crowd-sourcing platforms.
              </Typography>
              <Typography variant="body1" align="left" color="textPrimary" gutterBottom>
                If you have any questions or interest in collaborating on the data annotation process, please make a new Issue on the <Link href="https://github.com/vanvalenlab/deepcell-label/issues" target="_blank" rel="noopener noreferrer">repository issue page</Link>.
              </Typography>
            </Paper>

            <Paper className={classes.paper}>
              <Typography variant="h5" align="left" color="textPrimary" gutterBottom>
                Where can I get help?
              </Typography>
              <Typography variant="body1" align="left" color="textPrimary" gutterBottom>
                For an overview of the DeepCell ecocystem, please see the <Link href="/about">About page</Link> and our <Link href="https://github.com/vanvalenlab/intro-to-deepcell" target="_blank" rel="noopener noreferrer" >introductory docs</Link>.
                <br />
                If you would like to report a bug or ask a question, please open a new issue on <Link href="https://github.com/vanvalenlab/intro-to-deepcell/issues" target="_blank" rel="noopener noreferrer">the issues page</Link>.
              </Typography>
            </Paper>

          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
