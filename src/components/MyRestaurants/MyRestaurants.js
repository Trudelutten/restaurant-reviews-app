import React, { Component, Fragment } from 'react'
import { Col, Row, Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, Card, CardTitle, CardText } from 'reactstrap';

export class MyRestaurants extends Component {
	state = {
		restaurants: [],
		editIsOpen: false,
		createIsOpen: false,
		toggleRestaurant: []
	};
	_isMounted = false;

	componentDidMount() {
		this._isMounted = true;
		this.fetchData();
		
	}

	fetchData = () => {
		fetch('https://restaurant-reviews-node.herokuapp.com/restaurant')
			.then(res => res.json())
			.then(data => {
				const restaurants = data.filter(restaurant => parseInt(restaurant.user_id) === this.props.owner.user_id);
				if (this._isMounted) {
					this.setState(() => ({ restaurants: restaurants }));
				}
			})
			.catch(error => console.log(error));
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	openModal = (restaurant) => {
		this.setState(() => ({ editIsOpen: true, toggleRestaurant: restaurant }));
	}

	removeToggledRestaurant = () => {
		this.setState(() => ({ editIsOpen: false, toggleRestaurant: [] }));
	}

	openCreateModal = () => {
		this.setState(() => ({ createIsOpen: true }));
	}

	removeCreateModal = () => {
		this.setState(() => ({ createIsOpen: false }));
	}

	handleInputChange = (event) => {
		const target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name;

		const result = { [name]: value };

		this.setState({
			toggleRestaurant: { ...this.state.toggleRestaurant, ...result }
		});
	}

	render() {
		let restaurantsWrapper = null;
		let editModal = null;
		let createModal = null;
		const restaurants = this.state.restaurants.map(restaurant => {
			return (
				<div key={restaurant.restaurant_id} onClick={() => this.openModal(restaurant)}>
				<Col>
					<Card>
						<CardTitle> {restaurant.name} </CardTitle>
						<CardText>{restaurant.address}</CardText>
						<CardText>{restaurant.description}</CardText>

					</Card>
				</Col>
				</div>
			);
		});
		if (this.props.owner.user_id) {
			restaurantsWrapper = (
				<div>
					<Row>
						<Col xs="6" md="10"><h1>Manage your restaurants</h1></Col>
						<Col xs="6" md="2">
							<Button color="success" block className="mt-2" onClick={this.openCreateModal}>Add Restaurant</Button>
						</Col>
					</Row>
					
					{restaurants}
				</div>

			);
		} else {
			this.props.history.replace('/');
		}

		if (this.state.editIsOpen) {
			editModal = (
				<EditRestaurant isOpen={this.state.editIsOpen} restaurant={this.state.toggleRestaurant} close={this.removeToggledRestaurant} handleChange={this.handleInputChange} fetchData={this.fetchData}/>
			);
		}
		if (this.state.createIsOpen) {
			createModal = (
				<CreateRestaurant isOpen={this.state.createIsOpen} owner={this.props.owner} close={this.removeCreateModal} fetchData={this.fetchData}/>
			);
		}

		return (
			<Fragment>
				{restaurantsWrapper}
				{editModal}
				{createModal}
			</Fragment>
		)
	}
}

class EditRestaurant extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			modal: true
		};
	}

	close = () => {
		this.props.close();
	}

	updateRestaurant = () => {
		const data = {
			restaurant_id: this.props.restaurant.restaurant_id,
			name: this.props.restaurant.name,
			description: this.props.restaurant.description,
			category: this.props.restaurant.category,
			user_id: this.props.restaurant.user_id
		};

		console.log(data);
		fetch('https://restaurant-reviews-node.herokuapp.com/restaurant/update', {
			method: 'PUT',
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(data)
		})
			.then(res => res.json())
			.then(data => {
				this.props.fetchData();
				this.close();
			})
			.catch(error => console.log(error));
	}

	render() {
		return (
			<div>
				<Modal isOpen={this.state.modal} toggle={this.close} className={this.props.className}>
					<ModalHeader>{this.props.restaurant.name}</ModalHeader>
					<ModalBody>
						<Form>
							<FormGroup>
								<Label htmlFor="email">Restaurant Name</Label>
								<Input type="text" name="name" id="email" value={this.props.restaurant.name} onChange={this.props.handleChange} />
							</FormGroup>
							<FormGroup>
								<Label for="description">Description</Label>
								<Input type="textarea" name="description" id="description" value={this.props.restaurant.description} onChange={this.props.handleChange} />
							</FormGroup>
							<FormGroup>
								<Label htmlFor="category">Category</Label>
								<Input type="text" name="category" id="category" value={this.props.restaurant.category} onChange={this.props.handleChange} />
							</FormGroup>

							<Button onClick={this.updateRestaurant}>Submit</Button>
						</Form>
					</ModalBody>
				</Modal>
			</div>
		);
	}
}

class CreateRestaurant extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			modal: true,
			restaurant: {
				name: '',
				address: '',
				description: '',
				category: ''
			}
		};
	}

	close = () => {
		this.props.close();
	}

	createRestaurant = () => {
		const data = {user_id: this.props.owner.user_id, ...this.state.restaurant};

		fetch('https://restaurant-reviews-node.herokuapp.com/restaurant/create', {
			method: 'POST',
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(data)
		})
			.then(res => res.json())
			.then(data => {
				this.props.fetchData();
				this.close();
			})
			.catch(error => console.log(error));
	}

	handleInputChange = (event) => {
		const target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name;

		const result = { [name]: value };

		this.setState(() => ({...this.state, restaurant: {...this.state.restaurant, ...result}}));
	}

	render() {
		return (
			<div>
				<Modal isOpen={this.state.modal} toggle={this.close} className={this.props.className}>
					<ModalHeader>Create a new restaurant</ModalHeader>
					<ModalBody>
						<Form>
							<FormGroup>
								<Label htmlFor="email">Restaurant Name</Label>
								<Input type="text" name="name" id="email" value={this.state.restaurant.name} onChange={this.handleInputChange} />
							</FormGroup>
							<FormGroup>
								<Label htmlFor="address">Address</Label>
								<Input type="text" name="address" id="address" value={this.state.restaurant.address} onChange={this.handleInputChange} />
							</FormGroup>
							<FormGroup>
								<Label htmlFor="category">Category</Label>
								<Input type="text" name="category" id="category" value={this.state.restaurant.category} onChange={this.handleInputChange} />
							</FormGroup>
							<FormGroup>
								<Label for="description">Description</Label>
								<Input type="textarea" name="description" id="description" value={this.state.restaurant.description} onChange={this.handleInputChange} />
							</FormGroup>

							<Button onClick={this.createRestaurant}>Submit</Button>
						</Form>
					</ModalBody>
				</Modal>
			</div>
		);
	}
}


export default MyRestaurants;
