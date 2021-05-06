import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import queryString from 'query-string';
import FileUpload from './FileUpload';
import JobCard from './JobCard';
import ModelDropdown from './ModelDropdown';
import ScaleForm from './ScaleForm';
import ChannelForm from './ChannelForm';
import jobData from './jobData';

const REACT_APP_LABEL_FRONTEND = 'http://deepcell-label.s3-website.us-east-2.amazonaws.com';
const REACT_APP_LABEL_BACKEND = 'http://react-backend-test.q2qqtvkafv.us-east-2.elasticbeanstalk.com';
const labelFrontend = REACT_APP_LABEL_FRONTEND || 'localhost'; // process.env.REACT_APP_LABEL_FRONTEND?
const labelBackend = REACT_APP_LABEL_BACKEND || 'localhost'; // process.env.REACT_APP_LABEL_BACKEND?

// other option: add backend route that tells us what the Label backend server is
// would be a bit more kubernetes friendly; can switch at runtime instead of recompiling react app

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  progress: {
    margin: theme.spacing(2),
  },
  paddedTop: {
    paddingTop: theme.spacing(4),
  },
  capitalize: {
    textTransform: 'capitalize',
  },
  title: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(4),
    height: '100%',
    width: '100%',
  },
}));

const SubmitButton = ({ onClick, disabled }) => {
  const classes = useStyles();

  return <Grid id='submitButtonWrapper' item lg className={classes.paddedTop}>
    <Button
      id='submitButton'
      variant='contained'
      onClick={onClick}
      size='large'
      fullWidth
      disabled={disabled}
      color='primary'>
      Submit
    </Button>
  </Grid>;
};

SubmitButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

const ProgressBar = ({ progress, status }) => {
  const classes = useStyles();

  return <Grid item lg className={classes.paddedTop}>
    {progress === 0 || progress === null ?
      <LinearProgress
        variant="buffer"
        value={0}
        valueBuffer={0}
        className={classes.progress}
      />
      :
      <LinearProgress
        variant="determinate"
        value={progress}
        className={classes.progress}
      />
    }
    {/* Display status updates to user */}
    {status.length > 0 &&
      <Typography
        className={classes.paddedTop, classes.capitalize}
        variant='body1'
        align='center'
        color='primary'>
        Job Status: {status}
      </Typography>}
  </Grid>;
};

ProgressBar.propTypes = {
  progress: PropTypes.number.isRequired,
  status: PropTypes.string.isRequired,
};

const JobCompleteButtons = ({ imageUrl, downloadUrl, dimensionOrder }) => {
  return <div>
    <DownloadButton downloadUrl={downloadUrl} />
    <OpenInLabelButton
      imageUrl={imageUrl}
      downloadUrl={downloadUrl}
      dimensionOrder={dimensionOrder} />
    <SubmitNewButton />
  </div>;
};

JobCompleteButtons.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  downloadUrl: PropTypes.string.isRequired,
  dimensionOrder: PropTypes.string.isRequired,
};


const DownloadButton = ({ downloadUrl }) => {
  const classes = useStyles();

  return <Grid item lg className={classes.paddedTop}>
    <Button
      href={downloadUrl}
      variant='contained'
      size='large'
      fullWidth
      color='secondary'>
      Download Results
    </Button>
  </Grid>;
};

DownloadButton.propTypes = {
  downloadUrl: PropTypes.string.isRequired,
};

const OpenInLabelButton = ({ imageUrl, downloadUrl, dimensionOrder }) => {
  const classes = useStyles();

  const openResultsInLabel = () => {
    var formData = new FormData();
    formData.append('url', imageUrl);
    formData.append('labeled_url', downloadUrl);
    formData.append('axes', dimensionOrder);
    const newTab = window.open(labelFrontend, '_blank');
    axios({
      method: 'post',
      url: `${labelBackend}/api/project`,
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(res => {
      const url = `${labelFrontend}/?projectId=${res.data.projectId}`;
      newTab.location.href = url;
    });
  };

  return <Grid item lg className={classes.paddedTop}>
    <Button
      variant='contained'
      size='large'
      fullWidth
      color='default'
      onClick={openResultsInLabel}>
      View Results
    </Button>
  </Grid>;
};

OpenInLabelButton.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  downloadUrl: PropTypes.string.isRequired,
  dimensionOrder: PropTypes.string.isRequired,
};


const SubmitNewButton = () => {
  const classes = useStyles();

  return <Grid item lg className={classes.paddedTop}>
    <Button
      href='/predict'
      variant='contained'
      size='large'
      fullWidth
      color='primary'>
      Submit New Image
    </Button>
  </Grid>;
};

export default function Predict() {

  const [fileName, setFileName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [dimensionOrder, setDimensionOrder] = useState('');
  const [downloadUrl, setdownloadUrl] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [progress, setProgress] = useState(0);
  const [selectedJobType, setSelectedJobType] = useState('');
  const [isAutoRescaleEnabled, setIsAutoRescaleEnabled] = useState(true);
  const [displayRescaleForm, setDisplayRescaleForm] = useState(false);
  const [scale, setScale] = useState(1);
  const [status, setStatus] = useState('');

  /**
   * Select a channel for each target
   */
  const [targetChannels, setTargetChannels] = useState({});
  const channels = ['red', 'green', 'blue'];
  const channelValues =  Object.keys(channels).reduce((r, c) =>
    Object.assign(r, { [channels[c]]: parseInt((r[channels[c]] || '').concat(c)) }), {});

  const updateTargetChannels = (value, target) => {
    setTargetChannels({ ...targetChannels,  [target]: value });
  };

  const classes = useStyles();

  useEffect(() => {
    if (selectedJobType) {
      setDisplayRescaleForm(jobData[selectedJobType].scaleEnabled);
      const jobTargets = jobData[selectedJobType].requiredChannels;
      setTargetChannels(jobTargets.reduce((result, item, index) => {
        result[item] = channels[index];
        return result;
      }, {}));
    }
  }, [selectedJobType]);

  const expireRedisHash = (redisHash, expireIn) => {
    axios({
      method: 'post',
      url: '/api/redis/expire',
      data: {
        hash: redisHash,
        expireIn: expireIn
      }
    }).then((response) => {
      if (parseInt(response.data.value) !== 1) {
        setErrorText('Hash not expired');
      }
    }).catch(error => {
      setErrorText(`Failed to expire redis hash due to error: ${error}`);
    });
  };

  const checkJobStatus = (redisHash, interval) => {
    let statusCheck = setInterval(() => {
      axios({
        method: 'post',
        url: '/api/redis',
        data: {
          'hash': redisHash,
          'key': ['status', 'progress', 'output_url', 'reason', 'failures', 'dimension_order']
        }
      }).then((response) => {
        setStatus(response.data.value[0].split('-').join(' '));
        if (response.data.value[0] === 'failed') {
          clearInterval(statusCheck);
          setErrorText(`Job Failed: ${response.data.value[3]}`);
          expireRedisHash(redisHash, 3600);
        } else if (response.data.value[0] === 'done') {
          clearInterval(statusCheck);
          setdownloadUrl(response.data.value[2]);
          setDimensionOrder(response.data.value[5]);
          expireRedisHash(redisHash, 3600);
          // This is only used during zip uploads.
          // Some jobs may fail while other jobs can succeed.
          const failures = response.data.value[4];
          if (failures != null && failures.length > 0) {
            const parsed = queryString.parse(failures);
            let errText = 'Not all jobs completed!\n\n';
            for (const key in parsed) {
              errText += `Job Failed: ${key}: ${parsed[key]}\n\n`;
            }
            setErrorText(errText);
          }
        } else {
          let maybeNum = parseInt(response.data.value[1], 10);
          if (!isNaN(maybeNum)) {
            setProgress(maybeNum);
          }
        }
      }).catch(error => {
        let errMsg = `Trouble communicating with Redis due to error: ${error}`;
        setErrorText(errMsg);
      });
    }, interval);
  };

  const predict = () => {
    axios({
      method: 'post',
      url: '/api/predict',
      timeout: 60 * 4 * 1000, // 4 minutes
      data: {
        imageName: fileName,
        uploadedName: uploadedFileName,
        imageUrl: imageUrl,
        jobType: selectedJobType,
        dataRescale: isAutoRescaleEnabled ? (displayRescaleForm ? '' : '1') : scale,
        channels: (jobData[selectedJobType].requiredChannels).map(
          c => channelValues[targetChannels[c]]).join(','),
      }
    }).then((response) => {
      checkJobStatus(response.data.hash, 3000);
    }).catch(error => {
      let errMsg = `Failed to create job due to error: ${error}.`;
      setErrorText(errMsg);
    });
  };

  const canSubmit = () => {
    return fileName.length > 0 && imageUrl.length > 0;
  };

  const handleSubmit = (event) => {
    if (!canSubmit()) {
      event.preventDefault();
      return;
    }
    setSubmitted(true);
    setStatus('submitting');
    predict();
  };

  return (
    <div className={classes.root}>

      <Container maxWidth="md" className={classes.paddedTop}>
        <form autoComplete="off">
          <Grid container direction="row" justify="center" spacing={6}>

            {/* Job configuration for user on right column */}
            <Grid item xs={12} sm={6}>

              {/* Job Options section */}
              <Grid container>
                <Paper className={classes.paper}>
                  <Grid container>
                    <Grid item md={6}>
                      <Typography>
                        Prediction Type
                      </Typography>
                      <ModelDropdown
                        value={selectedJobType}
                        onChange={setSelectedJobType}
                        onError={setErrorText}
                      />
                    </Grid>
                    <Grid item md={6}>
                      {/* <Typography align="right">
                        Input Channels
                      </Typography> */}
                      <ChannelForm
                        channels={channels}
                        targetChannels={targetChannels}
                        onChange={updateTargetChannels}
                      />
                    </Grid>
                  </Grid>
                  
                  { displayRescaleForm && <Grid item lg>
                    <ScaleForm
                      checked={isAutoRescaleEnabled}
                      scale={scale}
                      onCheckboxChange={e => setIsAutoRescaleEnabled(Boolean(e.target.checked))}
                      onScaleChange={e => setScale(Number(e.target.value))}
                    />
                  </Grid>
                  }
                </Paper>
              </Grid>

              {/* File Upload section */}
              <Grid container direction="row" justify="center" className={classes.paddedTop}>
                <Paper className={classes.paper}>
                  <Grid item lg>
                    <FileUpload
                      infoText='Upload Here to Begin Image Prediction'
                      onDroppedFile={(uploadedName, fileName, url) => {
                        setUploadedFileName(uploadedName);
                        setFileName(fileName);
                        setImageUrl(url);
                      }} />
                  </Grid>
                </Paper>
              </Grid>

            </Grid>

            {/* Job info display on left column */}
            <Grid item xs={12} sm={6}>
              { selectedJobType.length > 0 &&
              <JobCard {...jobData[selectedJobType]} />
              }
            </Grid>

          </Grid>

          {/* Display error to user */}
          { errorText.length > 0 &&
            <Typography
              className={classes.paddedTop}
              variant='body2'
              style={{whiteSpace: 'pre-line'}}
              align='center'
              color='error'>
              {errorText}
            </Typography> }

          {/* Submit button */}
          { !submitted && <SubmitButton onClick={handleSubmit} disabled={!canSubmit()} /> }

          {/* Progress bar for submitted jobs */}
          { submitted && downloadUrl === null && errorText.length == 0 ?
            <ProgressBar progress={progress} status={status} />
            : null }

          {/* Download results, Open in Label, and Retry buttons */}
          { downloadUrl !== null &&
            <JobCompleteButtons
              imageUrl={imageUrl}
              downloadUrl={downloadUrl}
              dimensionOrder={dimensionOrder}
            />}

        </form>
      </Container>
    </div>
  );
}
