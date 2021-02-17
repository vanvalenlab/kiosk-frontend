/* eslint no-unused-vars: 0 */
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Container from '@material-ui/core/Container';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import queryString from 'query-string';
import FileUpload from './FileUpload';

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
  const [jobType, setJobType] = useState('');
  const [isAutoRescaleEnabled, setIsAutoRescaleEnabled] = useState('true');
  const [scale, setScale] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [allJobTypes, setAllJobTypes] = useState([]);

  const classes = useStyles();

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
        jobType : jobType,
        dataRescale: isAutoRescaleEnabled ? '' : scale
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

  const getAllJobTypes = () => {
    axios({
      method: 'get',
      url: '/api/jobtypes'
    }).then((response) => {
      setAllJobTypes(response.data.jobTypes);
      setJobType(response.data.jobTypes[0]);
    }).catch(error => {
      showErrorMessage(`Failed to get job types due to error: ${error}`);
    });
  };

  useEffect(() => getAllJobTypes(), [0]);

  return (
    <div className={classes.root}>
      <Typography
        className={classes.title}
        variant='h5'
        align='center'
        color='textPrimary'>
        Select Options | Upload your image | Download the results.
      </Typography>

      <Container maxWidth="md">
        <form autoComplete="off">
          <Grid container direction="row" justify="center" spacing={6}>

            {/* Job Options section */}
            <Grid item xs={12} sm={6} md={6}>
              <Paper className={classes.paper}>
                <Grid container direction="column" justify="center">

                  {/* Job Type Dropdown */}
                  <Grid item xs={12} sm={12} md={6}>
                    <Typography onClick={() => setIsOpen(true)}>
                      Job Type
                    </Typography>
                    <FormControl>
                      <Select
                        open={isOpen}
                        onClose={() => setIsOpen(false)}
                        onOpen={() => setIsOpen(true)}
                        onChange={e => setJobType(e.target.value)}
                        value={jobType}
                        style={{textTransform: 'capitalize'}}
                        inputProps={{
                          name: 'jobType',
                          id: 'jobTypeValue',
                        }}
                      >
                        {allJobTypes.map(job => (
                          <MenuItem value={job} style={{textTransform: 'capitalize'}} key={allJobTypes.indexOf(job)}>
                            {job}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Image Rescaling Options */}
                  <Grid item xs={12} sm={12} md={6} className={classes.paddedTop}>
                    <FormGroup row>
                      <FormControl>

                        <FormControlLabel
                          control={
                            <Checkbox checked={isAutoRescaleEnabled}
                              onChange={e => setIsAutoRescaleEnabled(e.target.checked)}
                              value={isAutoRescaleEnabled.toString()}
                            />
                          }
                          label="Rescale Automatically"
                        />

                        <TextField
                          id="outlined-number"
                          label="Rescaling Value"
                          disabled={isAutoRescaleEnabled}
                          value={scale}
                          onChange={e => setScale(e.target.value)}
                          type="number"
                          margin="dense"
                          variant="standard"
                        />
                      </FormControl>
                    </FormGroup>
                  </Grid>

                </Grid>
              </Paper>
            </Grid>

            {/* File Upload section */}
            <Grid item xs={12} sm={6} md={6}>
              <Paper className={classes.paper}>
                <FileUpload
                  infoText='Upload Here to Begin Image Prediction.'
                  onDroppedFile={(uploadedName, fileName, url) => {
                    setUploadedFileName(uploadedName);
                    setFileName(fileName);
                    setImageUrl(url);
                  }} />
              </Paper>
            </Grid>

          </Grid>

          {/* Display error to user */}
          { showError &&
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
