import React, { Component} from "react";
import "./App.css";
import {hot} from "react-hot-loader";
import Facade from "../Facade/Facade.js";

class App extends Component{

	render(){
	return(
		<div className="App">
			<Facade />
		</div>
	);
	}
}

export default hot(module)(App);