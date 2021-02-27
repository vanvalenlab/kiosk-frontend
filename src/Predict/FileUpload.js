import React, { useCallback, useState } from 'react';
import { PropTypes } from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CloudUpload from '@material-ui/icons/CloudUpload';
import axios from 'axios';
import Dropzone from 'react-dropzone';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    height: '100%',
  },
  preview: {
    borderRadius: theme.spacing(1),
    objectFit: 'cover',
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
  uploadIcon: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    height: '100%'
  }
}));

export default function FileUpload(props) {

  const [uploadedFileLocation, setUploadedFileLocation] = useState(null);
  const [showError, setShowError] = useState(false);
  const [errorText, setErrorText] = useState('');

  const { infoText, onDroppedFile } = props;

  const classes = useStyles();

  // This function will run upon file upload completion.
  const onDrop = useCallback((droppedFiles) => {
    if (droppedFiles.length > 1) {
      setShowError(true);
      setErrorText('Only single file uploads are supported.');
    } else {
      droppedFiles.map((f) => {
        let formData = new FormData();
        formData.append('file', f);
        axios.post('/api/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
          .then((response) => {
            setUploadedFileLocation(response.data.imageURL);
            onDroppedFile(response.data.uploadedName, f.name, response.data.imageURL);
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
      {({getRootProps, getInputProps}) => (
        <section>
          <div {...getRootProps()}>
            <input {...getInputProps()} />

            <Typography variant='subtitle1' display='block' align='center' color='textPrimary' paragraph>
              { infoText }
            </Typography>

            { uploadedFileLocation === null ?
              <>
                <Typography variant='caption' display='block' align='center' color='textSecondary' gutterBottom>
                  Drag and drop your files here or click to browse
                </Typography>

                <Typography variant='caption' display='block' align='center' color='textSecondary' gutterBottom>
                  Max image size is 2048x2048
                </Typography>
              </>
              : null }

            {/* Display error to user */}
            { showError &&
              <Typography className={classes.paddedTop} variant='caption' display='block' align='center' color='error'>
                { errorText }
              </Typography> }

            {/* Display preview of uploaded image */}
            { uploadedFileLocation !== null ?
              <div align='center' display='block'>
                <Typography variant='caption' align='center' color='textSecondary' paragraph={true}>
                  Successfully uploaded file!
                </Typography>
                <img className={classes.preview} src={uploadedFileLocation} />
              </div>
              :
              <div align='center' display='block'>
                <CloudUpload color='disabled' fontSize='large' className={classes.uploadIcon} />
              </div> }

          </div>
        </section>
      )}
    </Dropzone>
  );
}

FileUpload.propTypes = {
  infoText: PropTypes.string,
  onDroppedFile: PropTypes.func
};
