// ---------------------------------------------------------------------------------------------------------------------
// Imports
// ---------------------------------------------------------------------------------------------------------------------
import React from "react";
import { hot } from 'react-hot-loader/root';
// ---------------------------------------------------------------------------------------------------------------------
import Controller from "../controllers/StorageController";
import Hackamon from "../component/Hackamon";

// ---------------------------------------------------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------------------------------------------------

class HackamonBox extends React.Component {

    static contextType = Controller.Context;

	constructor(props) {
		super(props);
		this.state = {
			hackamonsData: [{Name:"Petalina", Type:"Grass", Img:"https://i.imgur.com/cULYdnN.png"}, 
							{Name:"Riparin", Type:"Fire", Img:"https://i.imgur.com/wvYMF78.png"},
							{Name:"Shaimit", Type:"Water", Img:"https://i.imgur.com/DM68og4.png"},
							{Name:"Petalina", Type:"Grass", Img:"https://i.imgur.com/cULYdnN.png"}, 
							{Name:"Riparin", Type:"Fire", Img:"https://i.imgur.com/wvYMF78.png"},
							{Name:"Shaimit", Type:"Water", Img:"https://i.imgur.com/DM68og4.png"},
							{Name:"Shaimit", Type:"Water", Img:"https://i.imgur.com/DM68og4.png"},
							{Name:"Petalina", Type:"Grass", Img:"https://i.imgur.com/cULYdnN.png"},
							{Name:"Petalina", Type:"Grass", Img:"https://i.imgur.com/cULYdnN.png"}, 
							{Name:"Riparin", Type:"Fire", Img:"https://i.imgur.com/wvYMF78.png"}],
		};
    }

	render() {
		return (
            <div className="row">

				{this.state.hackamonsData.map((hackamonData, i) =>
				<div className="col-md-2" key={i}>
						<Hackamon data={hackamonData}></Hackamon>
				</div>
				)}

            </div> 
		);
	}
}

export default hot(HackamonBox);
