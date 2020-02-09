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
			hackamonsData: [{Name:"Petalina", Type:"Grass", Img:"https://media.githubusercontent.com/media/eth-p/SYSHACK-2020/master/hackamon/petalina/petalina.png"}, 
							{Name:"Riparin", Type:"Fire", Img:"https://media.githubusercontent.com/media/eth-p/SYSHACK-2020/master/hackamon/riparin/Riparin.png"},
							{Name:"Shaimit", Type:"Water", Img:"https://media.githubusercontent.com/media/eth-p/SYSHACK-2020/master/hackamon/shaimit/shaimit.png"},
							{Name:"Riparin", Type:"Fire", Img:"https://media.githubusercontent.com/media/eth-p/SYSHACK-2020/master/hackamon/riparin/Riparin.png"},
							{Name:"Shaimit", Type:"Water", Img:"https://media.githubusercontent.com/media/eth-p/SYSHACK-2020/master/hackamon/shaimit/shaimit.png"},
							{Name:"Petalina", Type:"Grass", Img:"https://media.githubusercontent.com/media/eth-p/SYSHACK-2020/master/hackamon/petalina/petalina.png"},
							{Name:"Petalina", Type:"Grass", Img:"https://media.githubusercontent.com/media/eth-p/SYSHACK-2020/master/hackamon/petalina/petalina.png"},
							{Name:"Shaimit", Type:"Water", Img:"https://media.githubusercontent.com/media/eth-p/SYSHACK-2020/master/hackamon/shaimit/shaimit.png"},
							{Name:"Riparin", Type:"Fire", Img:"https://media.githubusercontent.com/media/eth-p/SYSHACK-2020/master/hackamon/riparin/Riparin.png"}],
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