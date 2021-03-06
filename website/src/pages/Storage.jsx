// ---------------------------------------------------------------------------------------------------------------------
// Imports
// ---------------------------------------------------------------------------------------------------------------------
import React from "react";
import {hot} from 'react-hot-loader/root';

// ---------------------------------------------------------------------------------------------------------------------
// Controller
// ---------------------------------------------------------------------------------------------------------------------

export Controller from "../controllers/StorageController";
import Controller from "../controllers/StorageController";
import HackamonCollectionPage from "../component/HackamonCollectionPage";

// ---------------------------------------------------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------------------------------------------------

class App extends React.Component {

	static contextType = Controller.Context;

	render() {
		return <HackamonCollectionPage/>;
	}
}

export default hot(App);
