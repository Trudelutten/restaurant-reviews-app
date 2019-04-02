import React from 'react';
import StarRatingComponent from 'react-star-rating-component';
import {
	Col,
	Card,
	CardText,
	CardBody,
	CardTitle,
	CardSubtitle
} from 'reactstrap';


const reviewCard = (props) => {
	return (
		<Col xs="12" md="4">
			<Card>
				<CardBody className="text-center">
					<CardTitle> {props.data.name} </CardTitle>
					<StarRatingComponent name="review star" starCount={5} starColor="#ffd700" value={parseInt(props.data.rating)} />
					<CardText>{props.data.review_text}</CardText>
					<CardSubtitle>Written by user: {props.data.username}</CardSubtitle>
				</CardBody>
			</Card>
		</Col>
	);
}

export default reviewCard;