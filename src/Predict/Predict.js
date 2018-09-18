import React from 'react';
import axios from 'axios';
import FileUpload from '../FileUpload/FileUpload';

export default class Predict extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: [],
      models: null,
      uploadedS3FileName: null,
      uploadedFileLocation: null,
      downloadURL: null
    };
  }

  componentDidMount() {
    this.retrieveModelsVersions();
  }

  retrieveModelsVersions() {
    axios.get('/api/getModels')
      .then((response) => {
        this.models = response.data.models;
        console.log(`Got Models: ${JSON.stringify(response.data.models, null, 4)}`);
      })
      .catch((error) => {
        console.log(`Error calling /api/getModels: ${error}`);
      });
  }

  //SEND UPLOADED IMAGE NAME TO REDIS FOR PREDICTION
  predictImage(fileName, s3Url) {
    let payload = {
      'imageName': fileName,
      'imageURL': s3Url,
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
        this.setState({ downloadURL: response.data.outputURL });
      })
      .catch(error => {
        console.log(`Error occurred while sending S3 Bucket URL to Express Server: ${error}`);
      });
  }

  render() {
    return (
      <section>
        <FileUpload onDroppedFile={(fileName, s3Url) => this.predictImage(fileName, s3Url)} />
      </section>
    );
  }
}
