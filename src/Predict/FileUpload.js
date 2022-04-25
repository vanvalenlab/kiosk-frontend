import React, { useCallback, useState } from 'react';
import { PropTypes } from 'prop-types';
import Typography from '@mui/material/Typography';
import CloudUpload from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/system';
import axios from 'axios';
import Dropzone from 'react-dropzone';

const Img = styled('img')``;

export default function FileUpload(props) {
  const [uploadedFileLocation, setUploadedFileLocation] = useState(null);
  const [showError, setShowError] = useState(false);
  const [errorText, setErrorText] = useState('');

  const { infoText, onDroppedFile } = props;

  // This function will run upon file upload completion.
  const onDrop = useCallback((droppedFiles) => {
    if (droppedFiles.length > 1) {
      setShowError(true);
      setErrorText('Only single file uploads are supported.');
    } else {
      droppedFiles.map((f) => {
        let formData = new FormData();
        formData.append('file', f);
        axios
          .post('/api/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          })
          .then((response) => {
            setUploadedFileLocation(response.data.imageURL);
            onDroppedFile(
              response.data.uploadedName,
              f.name,
              response.data.imageURL
            );
          })
          .catch((error) => {
            setShowError(true);
            setErrorText(`${error}`);
          });
      });
    }
  });

  // const { getRootProps, getInputProps, isDragActive } = useDropzone({onDrop});

  return (
    <Dropzone name='imageUploadInput' onDrop={onDrop}>
      {({ getRootProps, getInputProps }) => (
        <section>
          <div {...getRootProps()}>
            <input {...getInputProps()} />

            <Typography
              variant='subtitle1'
              display='block'
              align='center'
              color='textPrimary'
              paragraph
            >
              {infoText}
            </Typography>

            {uploadedFileLocation === null ? (
              <>
                <Typography
                  variant='caption'
                  display='block'
                  align='center'
                  color='textSecondary'
                  gutterBottom
                >
                  Drag and drop your files here or click to browse
                </Typography>

                <Typography
                  variant='caption'
                  display='block'
                  align='center'
                  color='textSecondary'
                  gutterBottom
                >
                  Max image size is 2048x2048
                </Typography>
              </>
            ) : null}

            {/* Display error to user */}
            {showError && (
              <Typography
                variant='caption'
                display='block'
                align='center'
                color='error'
              >
                {errorText}
              </Typography>
            )}

            {/* Display preview of uploaded image */}
            {uploadedFileLocation !== null ? (
              <div align='center' display='block'>
                <Typography
                  variant='caption'
                  align='center'
                  color='textSecondary'
                  paragraph={true}
                >
                  Successfully uploaded file!
                </Typography>
                <Img
                  sx={{
                    borderRadius: (theme) => theme.spacing(1),
                    objectFit: 'cover',
                    width: (theme) => theme.spacing(10),
                    height: (theme) => theme.spacing(10),
                  }}
                  src={uploadedFileLocation}
                />
              </div>
            ) : (
              <div align='center' display='block'>
                <CloudUpload
                  color='disabled'
                  fontSize='large'
                  sx={{ py: 4, height: '100%' }}
                />
              </div>
            )}
          </div>
        </section>
      )}
    </Dropzone>
  );
}

FileUpload.propTypes = {
  infoText: PropTypes.string,
  onDroppedFile: PropTypes.func,
};
