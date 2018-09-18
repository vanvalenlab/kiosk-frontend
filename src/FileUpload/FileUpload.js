import React, { Component } from 'react';
import './FileUpload.css';
import axios from 'axios';
import Dropzone from 'react-dropzone';

export default class FileUpload extends Component{
  //Constructor Function that will manage the state of this component
  constructor() {
    super();
    this.state = {
      file: [],
      models: [],
      modelAndVersionData: null,
      uploadedS3FileName: null,
      uploadedFileLocation: null,
      downloadURL: null,
      isMounted: null,
      selectedModel: null
    };
  }

  //React Lifecycle Method, called when component is already mount.
  //Used to make AJAX calls to retrieve data for application into components.
  componentDidMount() {
    this.retrieveModelsVersions();
  }

  //This function makes an AJAX call to retrieve the Models and Version from
  //the express server which parses the s3 bucket.
  retrieveModelsVersions() {
    console.log("Retrieving Models and Versions now...");
    axios.get('/api/getModels')
      .then((response) => {
        //create temporary modelsList container, fill it with the model names, then set it as state.models
        var modelsList = [];
        for(var key in response.data.models){
          modelsList.push(key);
        }
        this.setState({ models: modelsList });
        console.log(`State of Models: ${this.state.models}`);
        this.setState({ modelAndVersionData: response.data.models });
        console.log("State of modelsAndVersionData:" +  JSON.stringify(this.state.modelAndVersionData));
        // console.log(`Got Models: ${JSON.stringify(response.data.models, null, 4)}`);
      })
      .catch((error) => {
        console.log(`Failed calling /api/getModels: ${error}`);
      });
  }

  //This function will run upon file upload completion.
  onDrop(droppedFiles) {
    console.log(`Accepted Files: ${JSON.stringify(droppedFiles)}`);
    droppedFiles.map((f) => {
      let formData = new FormData();
      formData.append('file', f);
      axios.post('/api/s3upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
        .then((response) => {
          console.log(`Uploaded Image to: ${response.data.imageURL}`);
          this.setState({ uploadedFileLocation: response.data.imageURL });
          this.setState({ uploadedS3FileName: f.name });
          // Show uploaded filename / image preview?

          // Call predictImage()
          // Should be moved to a button, to pass model name/version
          // How to handle list of images?
          this.predictImage();
        })
        .catch((error) => console.log(error));
    });
  }

  //SEND UPLOADED IMAGE NAME TO REDIS FOR PREDICTION
  predictImage() {
    let payload = {
      'imageName': this.state.uploadedS3FileName,
      'imageURL': this.state.uploadedFileLocation,
      'model_name': process.env.MODEL_NAME,
      'model_version': process.env.MODEL_VERSION
    };
    console.log(JSON.stringify(payload));

    axios({
      method: 'post',
      url: '/api/predict',
      timeout: 60 * 4 * 1000, // 4 minutes
      data: payload
    })
      .then((response) => {
        console.log('Successfully sent S3 Bucket URL to Express Server: ', response);
        this.setState({ downloadURL: response.data.outputURL });
      })
      .catch(error => {
        console.log('Error occurred while sending S3 Bucket URL to Express Server : ', error);
      });
  }

  //for each value inside the array "this.state.models", iteratively create a <option> tag and then push it
  //into another array for rendering into the virtual dom.
  renderModelOptions() {
    var optionsArray = [];
    this.state.models.map(model => optionsArray.push(<option value={model} key={model}>{model}</option>));
    return optionsArray;
  }

  /*render the corresponding versions after the Model has been selected. */
  handleSelectChange(event){
    this.setState({
      selectedModel: event.target.value
    });
  }

  renderVersions() {
    var versionsArray = [];
    for(var key in this.state.modelAndVersionData){
      if(this.state.selectedModel === key){
        this.state.modelAndVersionData[key].map(version => versionsArray.push(<option value={version} key={version}>{version}</option>))
        return versionsArray;
      }
    }
  }

  //REACT RENDER FUNCTION
  render() {
    //JSX that will be returned to the User's View
    return (
      <section>
        <div className='dropzone'>
          {/*render models*/}
          { this.state.models !== null ?
          <select onClick={this.handleSelectChange}>
            {this.renderModelOptions()}
          </select>
          : null }
          {/*render versions*/}
          <select>
            {this.renderVersions()}
          </select>
          {/*Dropzone*/}
          <Dropzone
            acceptedFiles='image/*,application/zip'
            onDrop={this.onDrop.bind(this)}
          >
            <p className='uploadInstructions'> Drag & drop</p>
            <p className='uploadUnder'>your files here or <span>click</span> to browse.</p>
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
        { this.state.downloadURL !== null ?
          <div className="resultsBox">
            <div className="resultsAnimation">
              <ul className='loading-frame'>
                <div className='circle'></div>
                <div className='circle'></div>
                <div className='circle'></div>
                <div className='circle'></div>
                <div className='circle'></div>
                <div className='circle'></div>
                <div className='circle'></div>
                <div className='circle'></div>
                <div className='circle'></div>
                <div className='circle'></div>
              </ul>
            </div>
            <div className="downloadResults">
              <a href={this.state.downloadURL} className="buttonDownload">Download</a>
            </div>
          </div>
          : null }
      </section>
    );
  }
}
