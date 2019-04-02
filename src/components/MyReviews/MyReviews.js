import React, { Component, Fragment } from 'react'
import {
	Col, Row, Card, CardText,
	CardTitle, CardSubtitle, Button,
	Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input
} from 'reactstrap';

export class MyReviews extends Component {
	state = {
		reviews: [],
		editIsOpen: false,
		createIsOpen: false,
		toggleReview: []
	};
	_isMounted = false;

	componentDidMount() {
		this._isMounted = true;
		this.fetchData();
	}

	fetchData = () => {
		const id = this.props.user.user_id;
		fetch('https://restaurant-reviews-node.herokuapp.com/review/' + id)
			.then(res => res.json())
			.then(data => {
				if (this._isMounted) {
					const reviews = data.filter(review => parseInt(review.user_id) === this.props.user.user_id && review.active === 1);
					this.setState(() => ({ reviews: reviews }));
				}
			})
			.catch(error => console.log(error));
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	openModal = (review) => {
		this.setState(() => ({ editIsOpen: true, toggleReview: review }));
	}

	removeToggledReview = () => {
		this.setState(() => ({ editIsOpen: false, toggleReview: [] }));
	}

	openCreate = () => {
		this.setState(() => ({ createIsOpen: true }));
	}

	closeCreate = () => {
		this.setState(() => ({ createIsOpen: false }));
	}

	handleInputChange = (event) => {
		const target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name;

		const result = { [name]: value };

		this.setState({
			toggleReview: { ...this.state.toggleReview, ...result }
		});
	}

	render() {
		let reviewsWrapper = null;
		let editModal = null;
		let createModal = null;
		const reviews = this.state.reviews.map(review => {
			return (
				<div key={review.review_id} onClick={() => this.openModal(review)}>
					<Col>

						<Card>
							<CardTitle>{review.name}</CardTitle>
							<CardText>{review.rating} </CardText>
							<CardText>{review.review_text}</CardText>
							<CardSubtitle>{review.created_at}</CardSubtitle>
						</Card>

					</Col>
				</div>

			);

		});
		if (this.props.user.user_id) {
			reviewsWrapper = (
				<div>
					<Row>
						<Col xs="6" md="10"><h1>Manage your reviews</h1></Col>
						<Col xs="6" md="2">
							<Button color="success" block className="mt-2" onClick={this.openCreate}>Add Review</Button>
						</Col>
					</Row>

					{reviews}
				</div>

			);
		} else {
			this.props.history.replace('/');
		}

		if (this.state.editIsOpen) {
			editModal = (
				<EditReview isOpen={this.state.editIsOpen} review={this.state.toggleReview} close={this.removeToggledReview} handleChange={this.handleInputChange} fetchData={this.fetchData} />
			);
		}

		if (this.state.createIsOpen) {
			createModal = (
				<CreateReview isOpen={this.state.createIsOpen} close={this.closeCreate} fetchData={this.fetchData} owner={this.props.owner} reviews={this.state.reviews} getReviews={this.props.getReviews}/>
			);
		}

		return (
			<Fragment>
				{reviewsWrapper}
				{editModal}
				{createModal}
			</Fragment>
		)
	}
}

class EditReview extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			modal: true
		};
	}

	close = () => {
		this.props.close();
	}

	updateReview = () => {
		const data = {
			review_id: this.props.review.review_id,
			user_id: this.props.review.user_id,
			restaurant_id: this.props.review.restaurant_id,
			rating: this.props.review.rating,
			reviewText: this.props.review.review_text
		};

		fetch('https://restaurant-reviews-node.herokuapp.com/review/update', {
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

	render() {
		return (
			<div>
				<Modal isOpen={this.state.modal} toggle={this.close} className={this.props.className}>
					<ModalHeader>{this.props.review.name}</ModalHeader>
					<ModalBody>
						<Form>
							<FormGroup>
								<Label htmlFor="rating">Rating</Label>
								<Input type="text" name="rating" id="rating" value={this.props.review.rating} onChange={this.props.handleChange} />
							</FormGroup>
							<FormGroup>
								<Label htmlFor="review_text">Rating Text</Label>
								<Input type="text" name="review_text" id="review_text" value={this.props.review.review_text} onChange={this.props.handleChange} />
							</FormGroup>
							<Button onClick={this.updateReview}>Submit</Button>
						</Form>
					</ModalBody>
				</Modal>
			</div>
		);
	}
}

class CreateReview extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			modal: true,
			review: {
				restaurant_id: '',
				rating: '',
				reviewText: '',
				user_id: ''
			},
			restaurants: []
		};
	}

	componentDidMount() {
		fetch('https://restaurant-reviews-node.herokuapp.com/restaurant')
			.then(res => res.json())
			.then(data => {
				if (data.length > 0) {
					const restaurants = data.filter(restaurant => {
						for (let review of this.props.reviews) {
							if (review.restaurant_id === restaurant.restaurant_id)
								return false;
						}
						return true;
					})
					this.setState((prevState) => ({restaurants: restaurants, review: {...prevState.review, restaurant_id: restaurants[0].restaurant_id, user_id: this.props.owner.user_id}}));
				}
			})
			.catch(error => console.log(error));
	}

	close = () => {
		this.props.close();
	}

	createReview = () => {
		const data = { user_id: this.props.owner.user_id, ...this.state.review };

		fetch('https://restaurant-reviews-node.herokuapp.com/review/create', {
			method: 'POST',
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(data)
		})
			.then(res => res.json())
			.then(data => {
				this.props.fetchData();
				this.props.getReviews();
				this.close();
			})
			.catch(error => console.log(error));
	}

	handleInputChange = (event) => {
		const target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name;

		const result = { [name]: value };

		this.setState(() => ({ ...this.state, review: { ...this.state.review, ...result } }));
	}

	render() {
		const restaurants = this.state.restaurants.map(restaurant => {
			return (
				<option key={restaurant.restaurant_id} value={restaurant.restaurant_id}>{restaurant.name}</option>
			);
		});

		return (
			<div>
				<Modal isOpen={this.state.modal} toggle={this.close} className={this.props.className}>
					<ModalHeader>Create a new review</ModalHeader>
					<ModalBody>
						<Form>
							<FormGroup>
								<Label htmlFor="email">Restaurant Name</Label>
								<select className="custom-select" value={this.state.review.restaurant_id} onChange={this.handleInputChange} name="restaurant_id">
									{restaurants}
								</select>
							</FormGroup>
							<FormGroup>
								<Label htmlFor="category">Rating</Label>
								<Input type="text" name="rating" id="rating" value={this.state.review.rating} onChange={this.handleInputChange} />
							</FormGroup>
							<FormGroup>
								<Label for="reviewText">Your review</Label>
								<Input type="textarea" name="reviewText" id="reviewText" value={this.state.review.reviewText} onChange={this.handleInputChange} />
							</FormGroup>

							<Button onClick={this.createReview}>Submit</Button>
						</Form>
					</ModalBody>
				</Modal>
			</div>
		);
	}
}

export default MyReviews;
