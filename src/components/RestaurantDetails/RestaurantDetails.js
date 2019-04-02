import React, { Component, Fragment } from 'react';

import { Row, Col, Card, CardText, CardTitle, CardSubtitle } from 'reactstrap';

class RestaurantDetails extends Component {
	state = {
		restaurant: {},
		user: {},
		reviews: []
	}

	componentDidMount() {
		const id = this.props.match.params.id;
		fetch('https://restaurant-reviews-node.herokuapp.com/restaurant/' + id)
			.then(res => {
				return Promise.all([res, res.json()]);
			})
			.then(data => {
				if (data[0].ok) {
					fetch('https://restaurant-reviews-node.herokuapp.com/user/' + data[1].user_id)
						.then(res => res.json())
						.then(user => {
							this.setState(() => ({ restaurant: data[1], user }));
						})
						.catch(error => console.log(error));
				}
				else
					this.props.history.replace('/');
			})
			.catch(error => console.log(error));

		fetch('https://restaurant-reviews-node.herokuapp.com/review/restaurant/' + id)
			.then(res => {
				return Promise.all([res, res.json()]);
			})
			.then(data => {
				this.setState(() => ({ reviews: data[1] }));
			})
			.catch(error => console.log(error));

	}

	render() {
		const reviews = this.state.reviews.map(review => {
			return (
				<Card key={review.created_at}>
					<CardTitle>Rewiew</CardTitle>
					<CardTitle>{review.rating}</CardTitle>
					<CardText>{review.review_text}</CardText>					
					<CardSubtitle>Written by: {review.username}</CardSubtitle>
					<hr />				
					<CardSubtitle>{review.created_at}</CardSubtitle>
				</Card>
			);
		})

		return (
			<Fragment>
				<Row>
					<Col>
						<Card>
							<CardTitle>{this.state.restaurant.name}</CardTitle>
							<CardSubtitle>{this.state.restaurant.address}</CardSubtitle>
							<CardText>{this.state.restaurant.description}</CardText>
							<div className="mapouter">
								<div className="gmap_canvas">
									<iframe
										title="map"
										width="270"
										height="270"
										id="gmap_canvas"
										src={"https://maps.google.com/maps?q=" + this.state.restaurant.address + "&t=&z=13&ie=UTF8&iwloc=&output=embed"}
										frameBorder="0"
										scrolling="no"
										marginHeight="0"
										marginWidth="0">
									</iframe>
								</div>
							</div>
						</Card>
					</Col>
				</Row>

				<Row>
					<Col>
						{reviews}
					</Col>
				</Row>
			</Fragment>
		);
	}
}

export default RestaurantDetails;