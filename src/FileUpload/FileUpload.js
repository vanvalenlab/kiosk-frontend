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
			uploadedS3FileName: null,
			uploadedFileLocation: null,
			redisResponse: null
		}
	}

	//React Lifecycle Method, called when component is already mount.
	//Used to make AJAX calls to retrieve data for application into components.
	componentDidMount() {
		this.retrieveModelsVersions();
	}

	retrieveModelsVersions() {
		axios.get('/api/getModels')
		.then((response) => {
			this.models = response.data.models;
			console.log(`Got Models: ${response.data.models}`);
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
				this.state.uploadedFileLocation = response.data.imageURL;
				this.state.uploadedS3FileName = f.name;
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
			url: '/api/redis',
			timeout: 60 * 4 * 1000, // 4 minutes
			data: payload
		})
		.then(response => {
			console.log("Successfully sent S3 Bucket URL to Express Server: ", response);
			this.setState({redisResponse: response});
		})
		.catch(error => {
			console.log("Error occurred while sending S3 Bucket URL to Express Server : ", error)
		})
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
				{ this.state.redisResponse !== null ?
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
							<a href={this.state.redisResponse} className="buttonDownload">Download</a>
						</div>
					</div>
				: null }
			</section>
		)
	}
}
