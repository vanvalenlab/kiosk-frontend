import React from 'react';
import PropTypes from 'prop-types';
import { loadCSS } from 'fg-loadcss/src/loadCSS';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CloudUpload from '@material-ui/icons/CloudUpload';
import axios from 'axios';
import Dropzone from 'react-dropzone';

const styles = theme => ({
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
});

class FileUpload extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      file: [],
      downloadURL: null,
      uploadedFileLocation: null,
      showError: false,
      errorText: '',
    };
  }

  componentDidMount() {
    loadCSS(
      'https://use.fontawesome.com/releases/v5.1.0/css/all.css',
      document.querySelector('#insertion-point-css'),
    );
  }

  // This function will run upon file upload completion.
  onDrop(droppedFiles) {
    const { onDroppedFile } = this.props;

    if (droppedFiles.length > 1) {
      this.setState({ showError: true });
      this.setState({ errorText: 'Only single file uploads are supported.' });
    } else {
      droppedFiles.map((f) => {
        let formData = new FormData();
        formData.append('file', f);
        axios.post('/api/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
          .then((response) => {
            this.setState({ uploadedFileLocation: response.data.imageURL});
            onDroppedFile(response.data.uploadedName, f.name, response.data.imageURL);
          })
          .catch((error) => {
            this.setState({ showError: true });
            this.setState({ errorText: `${error}` });
          });
      });
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <Dropzone name='imageUploadInput' onDrop={this.onDrop.bind(this)}>
        {({getRootProps, getInputProps}) => (
          <section>
            <div {...getRootProps()}>
              <input {...getInputProps()} />

              <Typography variant='subtitle1' display='block' align='center' color='textPrimary' paragraph>
                { this.props.infoText }
              </Typography>

              <Typography variant='caption' display='block' align='center' color='textSecondary' gutterBottom>
                Drag and Drop your files here or click to browse.
              </Typography>

              {/* Display error to user */}
              { this.state.showError &&
                <Typography className={classes.paddedTop} variant='caption' display='block' align='center' color='error'>
                  { this.state.errorText }
                </Typography> }

              {/* Display preview of uploaded image */}
              { this.state.uploadedFileLocation !== null ?
                <div align='center' display='block'>
                  <Typography variant='caption' align='center' color='textSecondary' paragraph={true}>
                    Successfully uploaded file!
                  </Typography>
                  <img className={classes.preview} src={this.state.uploadedFileLocation} />
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
}

FileUpload.propTypes = {
  classes: PropTypes.object.isRequired,
  infoText: PropTypes.string,
  onDroppedFile: PropTypes.func
};

export default withStyles(styles)(FileUpload);
