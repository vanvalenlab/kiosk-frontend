import React, { Component } from 'react';
import './FileUpload.css';
import axios from 'axios';
import Dropzone from 'react-dropzone';
import S3Client from 'aws-s3';

//aws-s3 config
const config = {
  bucketName: process.env.AWS_S3_BUCKET ,
  region: process.env.AWS_REGION ,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID ,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
}

//start component class
export default class FileUpload extends Component{
	//Constructor Function that will manage the state of this component
	constructor() {
		super();
		this.state = {
			file: [],
			uploadedS3FileName: null,
			uploadedFileLocation: null
		}
	}

	//React Lifecycle Method, called when component is already mount.
	//Used to make AJAX calls to retrieve data for application into components.
	componentDidMount() {
		this.retrieveModelsVersions();
	}

	retrieveModelsVersions() {
		axios.get('/api/getModels')
    	.then(function (response) {
    		console.log(`getModels response: ${JSON.stringify(response)}`);
    	})
    	.catch((error) => {
    		console.log(`Failed calling /api/getModels: ${error}`);
    	});
	}

	//This function will run upon file upload completion.
	onDrop(droppedfile){
		console.log(`Accepted Files: ${JSON.stringify(droppedfile)}`);
		//set the component state with the uploaded files
		this.setState({file: droppedfile});
		//for each image that was selected by the file upload,
		this.state.file.map(f =>
			//Upload files to AWS S3 bucket
			S3Client
				.uploadFile(f, config)
				.then(data => {
					console.log(`Upload to s3 bucket was successful: ${JSON.stringify(data)}`);
					//set the uploadedFileLocation state to the s3 bucket image location that was just uploaded.
					this.setState({uploadedS3FileName: f.name})
					this.setState({uploadedFileLocation: data.location});
					//submit the URL to the predictImage() function, detailed below.
					this.predictImage();
				})
				.catch(err => console.error(err))
		)
	}

	//RUN TO POST S3UPLOAD INFORMATION TO THE EXPRESS SERVER
		//let destinationURL  = 'http://' + process.env.EXPRESS_HOST + ':' + process.env.EXPRESS_PORT + '/redis'
	predictImage(){
		console.log('Sending uploaded images S3 Bucket URL to the EXPRESS SERVER...');
		let destinationURL = '/api/redis';
    let payload = {
      'imageName': this.state.uploadedS3FileName,
      'imageURL': this.state.uploadedFileLocation,
      'model_name': process.env.MODEL_NAME,
      'model_version': process.env.MODEL_VERSION
    };
		console.log(destinationURL);
    console.log(JSON.stringify(payload));

		axios({
	    method: 'post',
	    url: destinationURL,
	    timeout: 60 * 4 * 1000, // 4 minutes
			data: payload
		})
		.then(response => console.log('Successfully sent S3 Bucket URL to Express Server : ', response))
		.catch(error => console.log('Error occurred while sending S3 Bucket URL to Express Server : ', error));
	}

	//REACT RENDER FUNCTION
	render() {
		//JSX that will be returned to the User's View
		return (
			<section>
				<div className='dropzone'>
					<Dropzone
						accept='image/*'
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
			</section>
		)
	}
}
