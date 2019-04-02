import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Col } from 'reactstrap';
import './RestaurantCard.css';
import StarRatingComponent from 'react-star-rating-component';
import {
	Card, CardText, CardBody,
	CardTitle, CardSubtitle
} from 'reactstrap';

class RestaurantCard extends Component {
	state = {
		rating: 0
	}

	componentDidMount() {
		this.props.reviews.then(data => {
			let rating = 0;
			for (let review of data) {
				rating += +review.rating;
			}
			this.setState(() => ({ rating: rating / data.length }));
		});
	}

	render() {
		return (
			<Col xs="12" md="4">
				<Link to={'/restaurant/' + this.props.restaurant_id} className="custom-card">
					<Card>
						<CardBody className="text-center">
							<CardTitle>{this.props.name}</CardTitle>
							<StarRatingComponent name="restaurant star" starCount={5} starColor="#ffd700" value={this.state.rating} />
							<CardSubtitle>{this.props.address}</CardSubtitle>
							<CardText>{this.props.description}</CardText>
							<div className="mapouter">
								<div className="gmap_canvas">
									<iframe
										title="map"
										width="270"
										height="270"
										id="gmap_canvas"
										src={"https://maps.google.com/maps?q=" + this.props.address + "&t=&z=13&ie=UTF8&iwloc=&output=embed"}
										frameBorder="0"
										scrolling="no"
										marginHeight="0"
										marginWidth="0">
									</iframe>
								</div>
							</div>
						</CardBody>
					</Card>
				</Link>
			</Col>
		);
	}
}

export default RestaurantCard;