import React from 'react';
import bcrypt from 'bcryptjs';
import './Login.css';

/*
const login = (props) => {
    return ();
}*/
class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = { isLoginOpen: true, isRegisterOpen: false };
	}
	showLoginBox() {
		this.setState({ isLoginOpen: true, isRegisterOpen: false })
	}
	showRegisterBox() {
		this.setState({ isRegisterOpen: true, isLoginOpen: false })
	}

	render() {

		return (
			<div className="root-container">

				<div className="box-controller">

					<div className={"controller " + (this.state.isLoginOpen ? "selected-controller" : "")} onClick={this.showLoginBox.bind(this)}>
						Login
                    </div>
					<div className={"controller " + (this.state.isRegisterOpen ? "selected-controller" : "")} onClick={this.showRegisterBox.bind(this)}>
						Register
                    </div>
				</div>



				<div className="box-container">

					{this.state.isLoginOpen && <LoginBox {...this.props} />}
					{this.state.isRegisterOpen && <RegisterBox {...this.props} />}

				</div>

			</div>
		);
	}
}

class LoginBox extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: ''
		};
	}

	submitLogin = (e) => {
		e.preventDefault();

		if (this.validateUser()) {
			fetch('https://restaurant-reviews-node.herokuapp.com/user/login', {
				method: 'POST',
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({ ...this.state })
			})
				.then(res => res.json())
				.then(data => {
					console.log(data);
					localStorage.setItem('token', data.token);
					this.props.checkAuthenticated();
					this.props.history.replace('/');
				})
				.catch(error => console.log(error));
		}
	}

	handleInputChange = (event) => {
		const target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name;

		this.setState({
			[name]: value
		});
	}

	validateUser = () => {
		return (
			this.state.username.length > 0 &&
			this.state.password.length > 0
		);
	}

	render() {
		return (
			<div className="inner-container">
				<div className="header">
					Login
            </div>
				<div className="box">
					<div className="input-group">
						<label htmlFor="username">Username  </label>
						<input type="text" name="username" className="login-input" placeholder="username" onChange={this.handleInputChange}></input>
					</div>

					<div className="input-group">
						<label htmlFor="password">Password </label>
						<input type="password" name="password" className="login-input" placeholder="password" onChange={this.handleInputChange}></input>
					</div>

					<button type="button" className="login-btn" onClick={this.submitLogin}> Login </button>

				</div>

			</div>
		);

	}
}

class RegisterBox extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: '',
			email: '',
			role: 1
		};
	}

	handleInputChange = (event) => {
		const target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name;

		this.setState({
			[name]: value
		});
	}

	submitRegister = (e) => {
		e.preventDefault();
		if (this.validateUser()) {
			//this.props.history.replace('/');
			const password = this.state.password;
			bcrypt.genSalt(10, (err, salt) => {
				bcrypt.hash(password, salt, (err, hash) => {
					fetch('https://restaurant-reviews-node.herokuapp.com/user/create', {
						method: 'POST',
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify({ ...this.state, password: hash })
					})
						.then(res => res.json())
						.then(data => {
							localStorage.setItem('token', data.token);
							this.props.checkAuthenticated();
							this.props.history.replace('/');
						})
						.catch(error => console.log(error));
				});
			});
		}
	}

	validateUser() {
		return (
			this.state.username.length > 0 &&
			this.state.password.length > 0 &&
			this.state.email.length > 0
		);
	}

	render() {
		return (
			<div className="inner-container">
				<div className="header">
					Register
            </div>
				<div className="box">
					<div className="input-group">
						<label htmlFor="username">Username  </label>
						<input type="text" name="username" className="login-input" placeholder="username" onChange={this.handleInputChange}></input>
					</div>

					<div className="input-group">
						<label htmlFor="email">Email </label>
						<input type="email" name="email" className="login-input" placeholder="username@mail.com" onChange={this.handleInputChange}></input>
					</div>

					<div className="input-group">
						<label htmlFor="password">Password </label>
						<input type="password" name="password" className="login-input" placeholder="password" onChange={this.handleInputChange}></input>
					</div>

					<label>Role</label>
					<select className="custom-select" value={this.state.role} onChange={this.handleInputChange} name="role">
						<option value="1">Restaurant Owner</option>
						<option value="2">Reviewer</option>
					</select>

					<button type="button" className="login-btn" onClick={this.submitRegister}> Register </button>

				</div>

			</div>
		);
	}
}

export default Login;