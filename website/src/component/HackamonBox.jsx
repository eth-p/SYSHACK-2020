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
			hackamonsData: [{Name:"Test", Img:"http://icons.iconarchive.com/icons/chrisbanks2/cold-fusion-hd/128/pikachu-icon.png"}, 
							{Name:"Test", Img:"http://icons.iconarchive.com/icons/chrisbanks2/cold-fusion-hd/128/pikachu-icon.png"},
							{Name:"Test", Img:"http://icons.iconarchive.com/icons/chrisbanks2/cold-fusion-hd/128/pikachu-icon.png"},
							{Name:"Test", Img:"http://icons.iconarchive.com/icons/chrisbanks2/cold-fusion-hd/128/pikachu-icon.png"},
							{Name:"Test", Img:"http://icons.iconarchive.com/icons/chrisbanks2/cold-fusion-hd/128/pikachu-icon.png"},
							{Name:"Test", Img:"http://icons.iconarchive.com/icons/chrisbanks2/cold-fusion-hd/128/pikachu-icon.png"},
							{Name:"Test", Img:"http://icons.iconarchive.com/icons/chrisbanks2/cold-fusion-hd/128/pikachu-icon.png"},
							{Name:"Test", Img:"http://icons.iconarchive.com/icons/chrisbanks2/cold-fusion-hd/128/pikachu-icon.png"}],
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