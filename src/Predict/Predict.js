import React, { useState, useEffect } from 'react';
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

export default function Predict() {

  const [fileName, setFileName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [downloadURL, setDownloadURL] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [progress, setProgress] = useState(0);
  const [selectedJobType, setSelectedJobType] = useState('');
  const [isAutoRescaleEnabled, setIsAutoRescaleEnabled] = useState(true);
  const [displayRescaleForm, setDisplayRescaleForm] = useState(false);
  const [scale, setScale] = useState(1);

  /**
   * Select a channel for each target
   */
  const [targetChannels, setTargetChannels] = useState({});
  const channels = ['gray', 'red', 'green', 'blue'];
  const channelValues = {
    gray: 0,
    red: 1,
    green: 2,
    blue: 3,
  };

  const updateTargetChannels = (value, target) => {
    setTargetChannels({ ...targetChannels,  [target]: value });
  };

  const classes = useStyles();

  useEffect(() => {
    if (selectedJobType) {
      setDisplayRescaleForm(jobData[selectedJobType].scaleEnabled);
      const jobTargets = jobData[selectedJobType].requiredChannels;
      if (jobTargets.length == 1) {
        // default single-target jobs to grayscale.
        setTargetChannels({ [jobTargets[0]]: channels[0] });
      } else if (jobTargets.length <= 3) {
        // default multi targets to RGB.
        setTargetChannels(jobTargets.reduce((result, item, index) => {
          result[item] = channels[index + 1];
          return result;
        }, {}));
      }
    }
  }, [selectedJobType]);

  const showErrorMessage = (errText) => {
    setErrorText(errText);
    setShowError(true);
  };

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
        showErrorMessage('Hash not expired');
      }
    }).catch(error => {
      showErrorMessage(`Failed to expire redis hash due to error: ${error}`);
    });
  };

  const checkJobStatus = (redisHash, interval) => {
    let statusCheck = setInterval(() => {
      axios({
        method: 'post',
        url: '/api/redis',
        data: {
          'hash': redisHash,
          'key': ['status', 'progress', 'output_url', 'reason', 'failures']
        }
      }).then((response) => {
        if (response.data.value[0] === 'failed') {
          clearInterval(statusCheck);
          showErrorMessage(`Job Failed: ${response.data.value[3]}`);
          expireRedisHash(redisHash, 3600);
        } else if (response.data.value[0] === 'done') {
          clearInterval(statusCheck);
          setDownloadURL(response.data.value[2]);
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
            showErrorMessage(errText);
          }
        } else {
          let maybeNum = parseInt(response.data.value[1], 10);
          if (!isNaN(maybeNum)) {
            setProgress(maybeNum);
          }
        }
      }).catch(error => {
        let errMsg = `Trouble communicating with Redis due to error: ${error}`;
        showErrorMessage(errMsg);
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
        channels: (jobData[selectedJobType].requiredChannels).map(c => channelValues[targetChannels[c]]).join(','),
      }
    }).then((response) => {
      checkJobStatus(response.data.hash, 3000);
    }).catch(error => {
      let errMsg = `Failed to create job due to error: ${error}.`;
      showErrorMessage(errMsg);
    });
  };

  const canBeSubmitted = () => {
    return fileName.length > 0 && imageUrl.length > 0;
  };

  const handleSubmit = (event) => {
    if (!canBeSubmitted()) {
      event.preventDefault();
      return;
    }
    setSubmitted(true);
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
                        onError={showErrorMessage}
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
          { !submitted &&
            <Grid id='submitButtonWrapper' item lg className={classes.paddedTop}>
              <Button
                id='submitButton'
                variant='contained'
                onClick={handleSubmit}
                size='large'
                fullWidth
                disabled={!canBeSubmitted()}
                color='primary'>
                Submit
              </Button>
            </Grid> }

          {/* Progress bar for submitted jobs */}
          { submitted && !showError && downloadURL === null ?
            progress === 0 || progress === null ?
              <Grid item lg className={classes.paddedTop}>
                <LinearProgress
                  variant="buffer"
                  value={0}
                  valueBuffer={0}
                  className={classes.progress}
                />
              </Grid>
              :
              <Grid item lg className={classes.paddedTop}>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  className={classes.progress}
                />
              </Grid>
            : null }

          {/* Download results and Retry buttons */}
          { downloadURL !== null &&
            <div>
              <Grid item lg className={classes.paddedTop}>
                <Button
                  href={downloadURL}
                  variant='contained'
                  size='large'
                  fullWidth
                  color='secondary'>
                  Download Results
                </Button>
              </Grid>

              <Grid item lg className={classes.paddedTop}>
                <Button
                  href='/predict'
                  variant='contained'
                  size='large'
                  fullWidth
                  color='primary'>
                  Submit New Image
                </Button>
              </Grid>
            </div> }

        </form>
      </Container>
    </div>
  );
}
