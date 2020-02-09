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
// import HackamonCollectionPage from "../component/HackamonCollectionPage";
import HackamanPartyPage from "../component/HackamonPartyPage";

// ---------------------------------------------------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------------------------------------------------

class App extends React.Component {

	static contextType = Controller.Context;

	render() {
		return <HackamanPartyPage/>;
	}
}

export default hot(App);
