import React from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import {
	Container,
	Collapse,
	Navbar,
	NavbarToggler,
	Nav,
	NavItem,
	NavLink
} from 'reactstrap';

class Navigation extends React.Component {
	constructor(props) {
		super(props);
		this.toggle = this.toggle.bind(this);
		this.state = {
			isOpen: false
		};
	}
	toggle() {
		this.setState({
			isOpen: !this.state.isOpen
		});
	}

	logoutUser = () => {
		this.props.logoutUser();
		this.props.history.replace('/');
	}

	render() {
		let leftLinks = null;

		let rightLinks = (
			<Nav className="ml-auto" navbar>
				<NavItem>
					<Link to="/" className="nav-link">{this.props.user.username}</Link>
				</NavItem>
				<NavItem>
					<NavLink onClick={this.logoutUser} href="#">Logout</NavLink>
				</NavItem>
			</Nav>
		);

		if (parseInt(this.props.user.role) === 1) {
			leftLinks = (
				<Nav className="mr-auto" navbar>
					<NavItem>
						<Link to="/restaurant" className="nav-link">Your restaurants</Link>
					</NavItem>
				</Nav>
			);
		}
		else if (parseInt(this.props.user.role) === 2) {
			leftLinks = (
				<Nav className="mr-auto" navbar>
					<NavItem>
						<Link to="/review" className="nav-link">Your Reviews</Link>
					</NavItem>
				</Nav>
			);
		} else {
			rightLinks = (
				<Nav className="ml-auto" navbar>
					<NavItem>
						<Link to="/login" className="nav-link">Login</Link>
					</NavItem>
				</Nav>
			)
		}

		return (
			<div>
				<Navbar color="light" light expand="md">
					<Container>
						<Link to="/" className="navbar-brand">{this.props.name}</Link>
						<NavbarToggler onClick={this.toggle} />
						<Collapse isOpen={this.state.isOpen} navbar>
							{leftLinks}
							{rightLinks}
						</Collapse>
					</Container>
				</Navbar>
			</div>
		);
	}
}

export default withRouter(Navigation);