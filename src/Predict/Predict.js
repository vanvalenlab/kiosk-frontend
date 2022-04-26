import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/system';
import axios from 'axios';
import queryString from 'query-string';
import FileUpload from './FileUpload';
import JobCard from './JobCard';
import jobData from './jobData';
import JobForm from './JobForm';
import ProgressBar from './ProgressBar';
import SubmitButton from './SubmitButtons';
import JobCompleteButtons from './JobCompleteButtons';
import ErrorText from './ErrorText';

const Div = styled('div')``;

export default function Predict() {
  const [fileName, setFileName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [progress, setProgress] = useState(0);
  const [jobType, setJobType] = useState('');
  const [submittedJobType, setSubmittedJobType] = useState('');
  const [status, setStatus] = useState('');
  const [jobForm, setJobForm] = useState({});

  const expireRedisHash = (redisHash, expireIn) => {
    axios({
      method: 'post',
      url: '/api/redis/expire',
      data: {
        hash: redisHash,
        expireIn: expireIn,
      },
    })
      .then((response) => {
        if (parseInt(response.data.value) !== 1) {
          setErrorText('Hash not expired');
        }
      })
      .catch((error) => {
        setErrorText(`Failed to expire redis hash due to error: ${error}`);
      });
  };

  const checkJobStatus = (redisHash, interval) => {
    let statusCheck = setInterval(() => {
      axios({
        method: 'post',
        url: '/api/redis',
        data: {
          hash: redisHash,
          key: ['status', 'progress', 'output_url', 'reason', 'failures'],
        },
      })
        .then((response) => {
          setStatus(response.data.value[0].split('-').join(' '));
          if (response.data.value[0] === 'failed') {
            clearInterval(statusCheck);
            // only show the full stack trace if NODE_ENV is not production
            let error = response.data.value[3];
            if (process.env.NODE_ENV === 'production') {
              const lines = error.split('\n');
              error = lines[lines.length - 1];
            }
            setErrorText(`Job Failed: ${error}`);
            expireRedisHash(redisHash, 3600);
          } else if (response.data.value[0] === 'done') {
            clearInterval(statusCheck);
            setDownloadUrl(response.data.value[2]);
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
        })
        .catch((error) => {
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
        jobType: jobType,
        jobForm: jobForm,
      },
    })
      .then((response) => {
        checkJobStatus(response.data.hash, 3000);
      })
      .catch((error) => {
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
    setSubmittedJobType(jobType);
    predict();
  };

  const [jobTypes, setJobTypes] = useState([]);

  const getJobTypes = () => {
    axios({
      method: 'get',
      url: '/api/jobtypes',
    })
      .then((response) => {
        setJobTypes(response.data.jobTypes);
        setJobType(response.data.jobTypes[0]);
      })
      .catch((error) => {
        setErrorText(`Failed to get job types due to error: ${error}`);
      });
  };

  useEffect(() => getJobTypes(), []);

  return (
    <Div sx={{ flexGrow: 1 }}>
      <Container maxWidth='md' sx={{ pt: 4 }}>
        <form autoComplete='off'>
          <Grid container direction='row' justifyContent='center' spacing={6}>
            {/* Job configuration for user on right column */}
            <Grid item xs={12} sm={6}>
              <JobForm
                jobTypes={jobTypes}
                jobType={jobType}
                setJobForm={setJobForm}
              />
              <FileUpload
                onDroppedFile={(uploadedName, fileName, url) => {
                  setUploadedFileName(uploadedName);
                  setFileName(fileName);
                  setImageUrl(url);
                }}
              />
            </Grid>
            {/* Job info display on left column */}
            <Grid item xs={12} sm={6}>
              {jobType.length > 0 && <JobCard {...jobData[jobType]} />}
            </Grid>
          </Grid>
          {/* Job submission and results on bottom row */}
          {/* Display error to user */}
          {errorText.length > 0 && <ErrorText errorText={errorText} />}
          {/* Submit button */}
          {!submitted && (
            <SubmitButton onClick={handleSubmit} disabled={!canSubmit()} />
          )}
          {/* Progress bar for submitted jobs */}
          {submitted && downloadUrl === null && errorText.length == 0 ? (
            <ProgressBar progress={progress} status={status} />
          ) : null}
          {/* Download results, Open in Label, and Retry buttons */}
          {downloadUrl !== null && (
            <JobCompleteButtons
              jobData={jobData[submittedJobType]}
              imagesUrl={imageUrl}
              labelsUrl={downloadUrl}
            />
          )}
        </form>
      </Container>
    </Div>
  );
}
