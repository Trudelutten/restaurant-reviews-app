import React, { Component, Fragment } from 'react';
import { Row } from 'reactstrap';

import RestaurantCard from '../../components/RestaurantCard/RestaurantCard';
import ReviewCard from '../../components/ReviewCard/ReviewCard';

class Home extends Component {
	getReviewsByRestaurantId = async (id) => {
		try {
			const res = await fetch('https://restaurant-reviews-node.herokuapp.com/review/restaurant/' + id);
			return await res.json();
		}
		catch (error) {
			return error;
		}
	}

	render() {
		const restaurants = this.props.restaurants.slice(0, 6).map(restaurant => {
			const reviews = this.getReviewsByRestaurantId(restaurant.restaurant_id);
			return (
				<RestaurantCard
					key={restaurant.restaurant_id}
					name={restaurant.name}
					address={restaurant.address}
					description={restaurant.description}
					restaurant_id={restaurant.restaurant_id}
					reviews={reviews} />
			);
		});

		const reviews = this.props.reviews.map(review => {
			return (
				<ReviewCard
					key={review.review_id}
					data={review} />
			);
		});

		return (
			<Fragment>
				<h1>Restaurants</h1>
				<Row>
					{restaurants}
				</Row>
				<hr />
				<h1>Reviews</h1>
				<Row>
					{reviews}
				</Row>
			</Fragment>
		);
	};
}

export default Home;