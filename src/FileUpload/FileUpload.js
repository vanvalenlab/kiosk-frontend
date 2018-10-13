import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Dropzone from 'react-dropzone';
import './FileUpload.css';

class FileUpload extends Component {
  // Constructor Function that will manage the state of this component
  constructor(props) {
    super(props);
    this.state = {
      file: [],
      downloadURL: null,
      uploadedFileLocation: null
    };
  }

  //This function will run upon file upload completion.
  onDrop(droppedFiles) {
    const { onDroppedFile } = this.props;
    droppedFiles.map((f) => {
      let formData = new FormData();
      formData.append('file', f);
      axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
        .then((response) => {
          this.setState({ uploadedFileLocation: response.data.imageURL});
          onDroppedFile(f.name, response.data.imageURL);
        })
        .catch((error) => console.log(error));
    });
  }

  //REACT RENDER FUNCTION
  render() {
    //JSX that will be returned to the User's View
    return (
      <div className='dropzone'>
        <Dropzone className='dropzoneCSS' accept='image/*' onDrop={this.onDrop.bind(this)} >
          <p className='uploadInstructions'>Upload Here to Begin { this.props.infoText }</p>
          <p className='uploadUnder'>Drag and Drop your files here or <span>click</span> to browse.</p>
          <div className='acceptedFiles'>
            { this.state.uploadedFileLocation !== null ?
              <ul>
                <p className='fileLabel'>File(s) Sent to S3:</p>
                <img className='uploadedImage' src={this.state.uploadedFileLocation}/>
                {this.state.file.map(f => <li className='fileName' key={f.name}>{f.name} <p className='fileSize'>{f.size} bytes</p></li>)}
              </ul>
              : null }
          </div>
        </Dropzone>
      </div>
    );
  }
}

FileUpload.propTypes = {
  onDroppedFile: PropTypes.func
};

export default FileUpload;
