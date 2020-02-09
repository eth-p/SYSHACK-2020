// ---------------------------------------------------------------------------------------------------------------------
// Imports
// ---------------------------------------------------------------------------------------------------------------------
import React from "react";
import { hot } from 'react-hot-loader/root';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
// ---------------------------------------------------------------------------------------------------------------------
import Controller from "../controllers/StorageController";

// ---------------------------------------------------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------------------------------------------------

class Hackamon extends React.Component {

	static contextType = Controller.Context;

	constructor(props) {
		super(props);
		this.state = { modalShow: false };
	}

	onHide = () => this.setState({ modalShow: false });

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
					<Button variant="secondary" onClick={() => this.setState({ modalShow: true })}>
						Stats
					</Button>
				</div>

				<Modal 
					show={this.state.modalShow}
					onHide={this.onHide}
					size="1g"
					aria-labelledby="contained-modal-title-vcenter"
					centered
				>

					<Modal.Header closeButton>
						<Modal.Title id ="contained-modal-title-vcenter">
							Hackamon Stats
						</Modal.Title>
					</Modal.Header>

					<Modal.Body>
					<ul class="list-group">
						<li class="list-group-item active">{this.props.data.Name}</li>
						<li class="list-group-item">{this.props.data.Type}</li>
					</ul> 
					</Modal.Body>

					<Modal.Footer>
						<Button variant="secondary" onClick={this.onHide}>Close</Button>
					</Modal.Footer>

				</Modal>				
    		</div>
		);
	}
}

export default hot(Hackamon);