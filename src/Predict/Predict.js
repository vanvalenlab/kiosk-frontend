import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/system';
import axios from 'axios';
import queryString from 'query-string';
import FileUpload from './FileUpload';
import JobCard from './JobCard';
import ModelDropdown from './ModelDropdown';
import ResolutionDropdown from './ResolutionDropdown';
import ChannelForm from './ChannelForm';
import jobData from './jobData';

// get DeepCell Label viewer addresses from the environment.
// these are defined in public/index.html to allow the server
// to override them at runtime.
const isProd = process.env.NODE_ENV === 'production';
// if prod, read from window override. otherwise pull from environment
const labelFrontend = isProd ?
  window.REACT_APP_LABEL_FRONTEND :
  (process.env.REACT_APP_LABEL_FRONTEND || 'localhost');

const labelBackend = isProd ?
  window.REACT_APP_LABEL_BACKEND :
  (process.env.REACT_APP_LABEL_BACKEND || 'localhost');

const Div = styled('div')``;

const SubmitButton = ({ onClick, disabled }) => {
  return (
    <Grid id='submitButtonWrapper' item lg sx={{ pt: 4 }}>
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
    </Grid>
  );
};

SubmitButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

const ProgressBar = ({ progress, status }) => {
  return (
    <Grid item lg sx={{ pt: 4 }}>
      {progress === 0 || progress === null ?
        <LinearProgress
          variant="buffer"
          value={0}
          valueBuffer={0}
          sx={{ m: 2 }}
        />
        :
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ m: 2 }}
        />
      }
      {/* Display status updates to user */}
      {status.length > 0 &&
        <Typography
          sx={{ pt: 4, textTransform: 'capitalize' }}
          variant='body1'
          align='center'
          color='primary'>
          Job Status: {status}
        </Typography>}
    </Grid>
  );
};

ProgressBar.propTypes = {
  progress: PropTypes.number.isRequired,
  status: PropTypes.string.isRequired,
};

const JobCompleteButtons = ({ openInLabel, imageUrl, downloadUrl, dimensionOrder }) => {
  return (
    <div>
      <DownloadButton downloadUrl={downloadUrl} />
      {openInLabel && imageUrl.split('.').pop() !== 'zip' &&
        <OpenInLabelButton
          imageUrl={imageUrl}
          downloadUrl={downloadUrl}
          dimensionOrder={dimensionOrder} />}
      <SubmitNewButton />
    </div>
  );
};

JobCompleteButtons.propTypes = {
  openInLabel: PropTypes.bool.isRequired,
  imageUrl: PropTypes.string.isRequired,
  downloadUrl: PropTypes.string.isRequired,
  dimensionOrder: PropTypes.string.isRequired,
};

const DownloadButton = ({ downloadUrl }) => {
  return (
    <Grid item lg sx={{ pt: 4 }}>
      <Button
        href={downloadUrl}
        variant='contained'
        size='large'
        fullWidth
        color='secondary'>
        Download Results
      </Button>
    </Grid>
  );
};

DownloadButton.propTypes = {
  downloadUrl: PropTypes.string.isRequired,
};

const OpenInLabelButton = ({ imageUrl, downloadUrl, dimensionOrder }) => {
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

  return (
    <Grid item lg sx={{ pt: 4 }}>
      <Button variant='contained' size='large' fullWidth onClick={openResultsInLabel}>
        View Results
      </Button>
    </Grid>
  );
};

OpenInLabelButton.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  downloadUrl: PropTypes.string.isRequired,
  dimensionOrder: PropTypes.string.isRequired,
};

const SubmitNewButton = () => {
  return (
    <Grid item lg sx={{ pt: 4 }}>
      <Button
        href='/predict'
        variant='contained'
        size='large'
        fullWidth
        color='primary'>
        Submit New Image
      </Button>
    </Grid>
  );
};

export default function Predict() {
  const [fileName, setFileName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [dimensionOrder, setDimensionOrder] = useState('');
  const [downloadUrl, setdownloadUrl] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [progress, setProgress] = useState(0);
  const [selectedJobType, setSelectedJobType] = useState('');
  const [submittedJobType, setSubmittedJobType] = useState('');
  const [displayRescaleForm, setDisplayRescaleForm] = useState(false);
  const [displayChannelForm, setDisplayChannelForm] = useState(false);
  const [modelResolution, setModelResolution] = useState(0.5);
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

  useEffect(() => {
    if (selectedJobType) {
      setDisplayRescaleForm(jobData[selectedJobType].scaleEnabled);
      setDisplayChannelForm(jobData[selectedJobType].channelEnabled);
      setModelResolution(jobData[selectedJobType].modelResolution);
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
          'key': ['status', 'progress', 'output_url', 'reason', 'failures', 'dim_order']
        }
      }).then((response) => {
        setStatus(response.data.value[0].split('-').join(' '));
        if (response.data.value[0] === 'failed') {
          clearInterval(statusCheck);
          // only show the full stack trace if NODE_NV is not production
          let error = response.data.value[3];
          if (process.env.NODE_ENV === 'production') {
            const lines = error.split('\n');
            error = lines[lines.length - 1];
          }
          setErrorText(`Job Failed: ${error}`);
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
        dataRescale: scale,
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
    setSubmittedJobType(selectedJobType);
    predict();
  };

  return (
    <Div sx={{ flexGrow: 1 }}>

      <Container maxWidth="md" sx={{ pt: 4 }}>
        <form autoComplete="off">
          <Grid container direction="row" justifyContent="center" spacing={6}>

            {/* Job configuration for user on right column */}
            <Grid item xs={12} sm={6}>

              {/* Job Options section */}
              <Grid container>
                <Paper sx={{ p: 4, height: '100%', width: '100%' }}>
                  <Grid container spacing={1}>

                    {/* Prediction type and Image Resolution in a column */}
                    <Grid item md={6}>
                      <Grid container direction={'column'} spacing={1}>
                        <Grid item>
                          <Typography>
                            Prediction Type
                          </Typography>
                          <ModelDropdown
                            value={selectedJobType}
                            onChange={setSelectedJobType}
                            onError={setErrorText}
                          />
                        </Grid>
                        { displayRescaleForm && <Grid item lg>
                          <Typography>Image Resolution</Typography>
                          <ResolutionDropdown
                            modelMpp={modelResolution}
                            scale={scale}
                            onChange={setScale}
                          />
                        </Grid>}
                      </Grid>
                    </Grid>
                    { displayChannelForm && <Grid item md={6}>
                      {/* <Typography align="right">
                        Input Channels
                      </Typography> */}
                      <ChannelForm
                        channels={channels}
                        targetChannels={targetChannels}
                        onChange={updateTargetChannels}
                      />
                    </Grid>}
                  </Grid>
                </Paper>
              </Grid>

              {/* File Upload section */}
              <Grid container direction="row" justifyContent="center" sx={{ pt: 4 }}>
                <Paper sx={{ p: 4, height: '100%', width: '100%' }}>
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
            <div>
              <Typography
                sx={{ pt: 4, whiteSpace: 'pre-line' }}
                variant='body2'
                align='center'
                color='error'>
                {errorText}
              </Typography>
              <Typography
                sx={{ pt: 4 }}
                variant='subtitle2'
                align='center'
                color='error'>
                See the <Link href='/faq' target='_blank' rel='noopener noreferrer'>FAQ</Link> for information on common errors.
              </Typography>
            </div> }

          {/* Submit button */}
          { !submitted && <SubmitButton onClick={handleSubmit} disabled={!canSubmit()} /> }

          {/* Progress bar for submitted jobs */}
          { submitted && downloadUrl === null && errorText.length == 0 ?
            <ProgressBar progress={progress} status={status} />
            : null }

          {/* Download results, Open in Label, and Retry buttons */}
          { downloadUrl !== null &&
            <JobCompleteButtons
              openInLabel={jobData[submittedJobType].canOpenInLabel}
              imageUrl={imageUrl}
              downloadUrl={downloadUrl}
              dimensionOrder={dimensionOrder}
            />}

        </form>
      </Container>
    </Div>
  );
}
