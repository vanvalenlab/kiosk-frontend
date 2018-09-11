import React, { Component} from "react";
import FileUpload from "../FileUpload/FileUpload.js";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Logo from "../Logo/Logo.js";
import "./Facade.css";

export default class Facade extends Component{

	render(){
		return(
			<div>
        <Logo />
        <Tabs>
          <TabList>
            <Tab>Prediction</Tab>
            <Tab>Training</Tab>
            <Tab>Options</Tab>
            <a className="navLink" href="http://131.215.8.170:8888">Jupyter</a>
            <a className="navLink" href="https://github.com/vanvalenlab">Github</a>
          </TabList>

          <TabPanel>
            {/* Upload an Image */}
            <div>
                <FileUpload />
            </div>
          </TabPanel>

          <TabPanel>
            {/* Training Panel */}
            <div className="training">
            	This is the Training Panel
            </div>
          </TabPanel>

          <TabPanel>
            {/* Options */}
            <div className="Options">
            	This is the options panel
            </div>
          </TabPanel>
        </Tabs>
			</div>
		);
	}
}
