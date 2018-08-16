import React, { Component} from "react";
import "./FileUpload.css";
import axios from 'axios';
import Dropzone from 'react-dropzone';
import S3Client from 'aws-s3';

//s3 config
const config = {
    bucketName: 'deepcell-output',
    region: 'us-east-1',
    accessKeyId: 'AKIAJVU4424U3GBF56QQ',
    secretAccessKey: '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',
}

//start component class
export default class FileUpload extends Component{
	//Constructor Function that will manage the state of this component
	constructor() {
		super();
		this.state = {
			file: [],
			uploadedFileLocation: null,
		}
	}

	//This function will run upon file upload completion.
	onDrop(droppedfile){
		console.log("Accepted Files: " + JSON.stringify(droppedfile));
		//set the component state with the uploaded files
		this.setState({file: droppedfile});
		//for each image that was selected by the file upload,
		this.state.file.map(f => 
			//Upload files to AWS S3 bucket
			S3Client
				.uploadFile(f, config)
				.then(data => {
					console.log("Upload to s3 bucket was successful: " + data);
					//set the uploadedFileLocation state to the s3 bucket image location that was just uploaded.
					this.setState({uploadedFileLocation: data.location});
					//submit the URL to the predictImage() function, detailed below.
					this.predictImage();
				})
				.catch(err => console.error(err))
		)
	}

	//RUN TO POST S3UPLOAD INFORMATION TO THE FLASK API
	predictImage(){
		console.log("Sending uploaded image's S3 Bucket URL to the Flask API...");

		axios.post("http://localhost:1337/predict/default/0", {
			"instances": [
				{
				"image": this.state.uploadedFileLocation
				}
			]
		})
		.then(response => console.log("Successfully sent S3 Bucket URL to Flask API.", response))
		.catch(error => console.log("Error occurred while sending S3 Bucket URL to Flask API.", error))
	}

	//REACT RENDER FUNCTION
	render() {
		//JSX that will be returned to the User's View
		return (
			<section>
				<div className="dropzone">
					<Dropzone
						accept="image/*"
						onDrop={this.onDrop.bind(this)}
					>
						<p className="uploadInstructions"> Drag & drop</p>
						<p className="uploadUnder">your files here or <span>click</span> to browse.</p>
						<div className="acceptedFiles">
							{ this.state.uploadedFileLocation !== null ?
								<ul>
									<p className="fileLabel">File(s) Sent to S3:</p>
									<img className="uploadedImage" src={this.state.uploadedFileLocation}/>
									{this.state.file.map(f => <li className="fileName" key={f.name}>{f.name} <p className="fileSize">{f.size} bytes</p></li>)}
								</ul>
							: null }
						</div>
					</Dropzone>
				</div>
			</section>
		)
	}
}