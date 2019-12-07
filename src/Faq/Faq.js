import React from 'react';
import PropTypes from 'prop-types';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
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
});

class Faq extends React.Component {
  render() {
    const { classes } = this.props;

    return(
      <div className={classes.root}>
        <Typography variant="h2" align="center" color="textPrimary" gutterBottom className={classes.title}>
          Frequently Asked Qustions
        </Typography>

        <Container maxWidth="md">
          <Grid container spacing={3}>
            <Grid item xs={12}>

              <Paper className={classes.paper}>
                <Typography variant="h5" align="left" color="textPrimary" gutterBottom>
                  What is DeepCell?
                </Typography>
                <Typography variant="body1" align="left" color="textPrimary" gutterBottom>
                  DeepCell is a software ecosystem that enables deep learning based biological image analysis in the cloud.

                  It consists of several software packages, including the deep learning library <i>deepcell-tf</i>, and a Kubernetes cloud deployment platform, the <i>DeepCell Kiosk</i>.
                </Typography>
              </Paper>

              <Paper className={classes.paper}>
                <Typography variant="h5" align="left" color="textPrimary" gutterBottom>
                  How do I get started using DeepCell?
                </Typography>
                <Typography variant="body1" align="left" color="textPrimary" gutterBottom>
                  This website is an implementation of the DeepCell Kiosk, and is running on the <Link href="https://cloud.google.com/kubernetes-engine/" target="_blank" rel="noopener noreferrer">Google Kubernetes Engine</Link>.

                  You can use the Predict tab to upload image files and segment them with our pre-trained models. There is example data for uploading on the Data tab.

                  Additionally, you can deploy your own DeepCell Kiosk by following the instructions on <Link href="https://github.com/vanvalenlab/kiosk" target="_blank" rel="noopener noreferrer">the GitHub</Link>.
                </Typography>
                <Typography variant="body1" align="left" color="textPrimary" gutterBottom>
                  The deployment comes with pre-trained models for a few common tasks, including nuclear segmentation and nuclear tracking.

                  These models are hosted with <Link href="https://github.com/tensorflow/serving" target="_blank" rel="noopener noreferrer">TensorFlow Serving</Link> and are running on auto-scaling GPUs to minimize cost.

                  The servable model files can be found in our <Link href="https://console.cloud.google.com/storage/browser/deepcell-models" target="_blank" rel="noopener noreferrer">public bucket</Link>.

                  Documentation for the DeepCell Kiosk can be found <Link href="https://deepcell-kiosk.readthedocs.io/en/latest/" rel="noopener noreferrer" target="_blank">here</Link>.
                </Typography>
              </Paper>

              <Paper className={classes.paper}>
                <Typography variant="h5" align="left" color="textPrimary" gutterBottom>
                  What is the DeepCell Kiosk?
                </Typography>
                <Typography variant="body1" align="left" color="textPrimary" gutterBottom>
                  The DeepCell Kiosk is a turn-key cloud solution for large-scale image processing with deep learning models.

                  It is a public software and fully extensible for custom image processing tasks.
                </Typography>
                <Typography variant="body1" align="left" color="textPrimary" gutterBottom>
                  The deployment comes with pre-trained models for a few common tasks, including nuclear segmentation and nuclear tracking.

                  These models are hosted with <Link href="https://github.com/tensorflow/serving" target="_blank" rel="noopener noreferrer">TensorFlow Serving</Link> and are running on auto-scaling GPUs to minimize cost.

                  The servable model files can be found in our <Link href="https://console.cloud.google.com/storage/browser/deepcell-models" target="_blank" rel="noopener noreferrer">public bucket</Link>.

                  Documentation for the DeepCell Kiosk can be found <Link href="https://deepcell-kiosk.readthedocs.io/en/latest/" rel="noopener noreferrer" target="_blank">here</Link>.
                </Typography>
                <Typography variant="body1" align="left" color="textPrimary" gutterBottom>
                  This website is an implementation of the <Link href="https://github.com/vanvalenlab/kiosk/tree/production" target="_blank" rel="noopener noreferrer">production branch</Link> of the DeepCell Kiosk, and is running on the <Link href="https://cloud.google.com/kubernetes-engine/" target="_blank" rel="noopener noreferrer">Google Kubernetes Engine</Link>.
                </Typography>
              </Paper>

              <Paper className={classes.paper}>
                <Typography variant="h5" align="left" color="textPrimary" gutterBottom>
                  What is deepcell-tf?
                </Typography>
                <Typography variant="body1" align="left" color="textPrimary" gutterBottom>
                  <Link href="https://github.com/vanvalenlab/deepcell-tf" rel="noopener noreferrer" target="_blank">deepcell-tf</Link> is a TensorFlow/Keras based Python library for training deep learning models for biological image analysis.
                  All models hosted on DeepCell.org have been trained using this library.

                  Documentation for the library can be found <Link href="https://deepcell.readthedocs.io/en/documentation/readme_link.html" rel="noopener noreferrer" target="_blank">here</Link>.
                </Typography>
                <Typography variant="body1" align="left" color="textPrimary" gutterBottom>

                </Typography>
              </Paper>

              <Paper className={classes.paper}>
                <Typography variant="h5" align="left" color="textPrimary" gutterBottom>
                  Can I use my own models?
                </Typography>
                <Typography variant="body1" align="left" color="textPrimary" gutterBottom>
                  Custom models must be exported for TensorFlow Serving and saved in a cloud bucket defined when deploying a new DeepCell Kiosk.

                  TensorFlow Serving will read the bucket when it is starting up, and will load all exported models it finds.
                </Typography>
                <Typography variant="body1" align="left" color="textPrimary" gutterBottom>
                  <Link href="https://github.com/vanvalenlab/deepcell-tf/blob/d0d3c10a76834ef23c851277803ae3c0c404f5aa/deepcell/utils/export_utils.py#L41" target="_blank" rel="noopener noreferrer">See here</Link> for a custom Python function for exporting models to TensorFlow Serving.

                  The model can be exported directly to the cloud bucket with the appropriate protocol prefix (e.g. <i>s3://bucket/model</i> or <i>gs://bucket/model</i>)
                </Typography>
              </Paper>

              <Paper className={classes.paper}>
                <Typography variant="h5" align="left" color="textPrimary" gutterBottom>
                  Can I add a custom job type?
                </Typography>
                <Typography variant="body1" align="left" color="textPrimary" gutterBottom>
                  This is a bit more involved and requires forked changes to both the <Link href="https://github.com/vanvalenlab/kiosk-frontend" rel="noopener noreferrer" target="_blank">frontend</Link> as well as the <Link href="https://github.com/vanvalenlab/kiosk-redis-consumer" rel="noopener noreferrer" target="_blank">consumers</Link>.

                  The frontend places jobs in a Redis queue, and the consumers will perform all the work. New jobs will require a new job queue, which are listed in the dropdown list on the <Link href="/predict">Predict page</Link>.

                  Custom jobs will also require new consumer with any required pre- and post-processing steps to be defined and deployed in the DeepCell Kiosk with a custom <Link href="https://github.com/roboll/helmfile" rel="noopener noreferrer" target="_blank">helmfile</Link> for the new consumer.
                </Typography>
              </Paper>

              <Paper className={classes.paper}>
                <Typography variant="h5" align="left" color="textPrimary" gutterBottom>
                  Where do I get data?
                </Typography>
                <Typography variant="body1" align="left" color="textPrimary" gutterBottom>
                  We have uploaded some sample data both on the <Link href="/data">Data page</Link>.
                  The prediction data is meant to be used with the pre-trained models while
                  the training data is available for download for training new models.
                </Typography>
                <Typography variant="body1" align="left" color="textPrimary" gutterBottom>
                  The training data is also available in <Link href="https://github.com/vanvalenlab/deepcell-tf/tree/master/deepcell/datasets" target="_blank" rel="noopener noreferrer">deepcell.datasets</Link> which can be used directly within a Python environment.
                </Typography>
              </Paper>

              <Paper className={classes.paper}>
                <Typography variant="h5" align="left" color="textPrimary" gutterBottom>
                  Can you help me annotate my data?
                </Typography>
                <Typography variant="body1" align="left" color="textPrimary" gutterBottom>
                  Yes! Our training data was created using <Link href="https://github.com/vanvalenlab/Caliban" target="_blank" rel="noopener noreferrer">Caliban</Link>, a tool for creating segmentation masks for images.
                  Caliban is an open-source web application that can integrate with crowd-sourcing platforms like <Link href="https://www.figure-eight.com" target="_blank" rel="noopener noreferrer">Figure Eight</Link>.
                </Typography>
              </Paper>

            </Grid>
          </Grid>
        </Container>
      </div>
    );
  }
}

Faq.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Faq);
