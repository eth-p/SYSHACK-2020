// ---------------------------------------------------------------------------------------------------------------------
// Imports
// ---------------------------------------------------------------------------------------------------------------------
import React from "react";
import {hot} from 'react-hot-loader/root';

// ---------------------------------------------------------------------------------------------------------------------
// Controller
// ---------------------------------------------------------------------------------------------------------------------

export Controller from "../controllers/PartyController";
import Controller from "../controllers/PartyController";
import HackamonPartyPage from "../component/HackamonPartyPage";

// ---------------------------------------------------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------------------------------------------------

class App extends React.Component {

	static contextType = Controller.Context;

	render() {
		return <HackamonPartyPage/>;
	}
}

export default hot(App);
