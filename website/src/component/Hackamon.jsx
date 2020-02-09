// ---------------------------------------------------------------------------------------------------------------------
// Imports
// ---------------------------------------------------------------------------------------------------------------------
import React from "react";
import { hot } from 'react-hot-loader/root';
// ---------------------------------------------------------------------------------------------------------------------
import Controller from "../controllers/StorageController";

// ---------------------------------------------------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------------------------------------------------

class Hackamon extends React.Component {

	static contextType = Controller.Context;

	render() {	

		return (
			<div>
				<div className="row justify-content-center">
					<p className="hackamon-name">{this.props.data.Name}</p>
				</div>

				<div className="row justify-content-center">
					<img src={this.props.data.Img} height="128" width="128" /> 
				</div>

				<div className="row justify-content-center">
					<button type="button" className="btn btn-primary">View Stats</button>
				</div>
				
    		</div>
		);
	}
}

export default hot(Hackamon);