// ---------------------------------------------------------------------------------------------------------------------
// Imports
// ---------------------------------------------------------------------------------------------------------------------
import React from "react";

// ---------------------------------------------------------------------------------------------------------------------
// Controller
// ---------------------------------------------------------------------------------------------------------------------

export default class Controller {

	constructor(params) {
		this.user = {
			id: params.snowflake
		};
	}

}

Controller.Context = React.createContext(null);
