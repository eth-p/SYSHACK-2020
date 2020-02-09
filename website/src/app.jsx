// ---------------------------------------------------------------------------------------------------------------------
// Imports
// ---------------------------------------------------------------------------------------------------------------------
import React from "react";
import {hot} from 'react-hot-loader/root';
import {useParams} from "react-router";
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import * as Storage from "./pages/Storage";
import * as Party from "./pages/PartyPage";

function route(module, route) {
	function Child() {
		const params = useParams();
		const controller = new module.Controller(params);
		const Context = module.Controller.Context;
		return <Context.Provider value={controller}><module.default/></Context.Provider>;
	}

	return <Route path={route} children={<Child/>}/>;
}

// ---------------------------------------------------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------------------------------------------------

function App() {
	return (
		<Router>
			<Switch>
				{route(Storage, '/main/')}
				{route(Party, '/party/')}
			</Switch>
		</Router>
	);
}

export default hot(App);
