// ---------------------------------------------------------------------------------------------------------------------
// Imports
// ---------------------------------------------------------------------------------------------------------------------
import React from "react";
import { hot } from 'react-hot-loader/root';
// ---------------------------------------------------------------------------------------------------------------------
import Controller from "../controllers/StorageController";
import HackamonBox from "../component/HackamonBox";

// ---------------------------------------------------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------------------------------------------------

class HackamonCollectionPage extends React.Component {

	static contextType = Controller.Context;

	render() {

		return (

			<div>
				<div className="jumbotron text-center jumbotron-fluid border-bottom border-dark">
					<img src="https://cdn.discordapp.com/attachments/665832778046373919/675852344227004466/Logo_350x230.png" height="350" width="500" />
				</div>

				<div className="container center">
					<HackamonBox></HackamonBox>
				</div>
			</div>
		);
	}
}

export default hot(HackamonCollectionPage);