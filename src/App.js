import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Container } from 'reactstrap';
import './App.css';

import { getRestaurants } from './services/RestaurantService';

import Nav from './components/Navigation/Navigation';
import Home from './containers/Home/Home';
import RestaurantDetails from './components/RestaurantDetails/RestaurantDetails';
import Login from './containers/Login/Login';
import MyRestaurant from './components/MyRestaurants/MyRestaurants';
import MyReview from './components/MyReviews/MyReviews';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeUser: [],
      restaurants: [],
      reviews: []
    }
  }

  componentDidMount() {
    if (localStorage.getItem('token')) {
      this.checkAuthenticated();
    } else {
      console.log('No token');
    }

    getRestaurants()
      .then(restaurants => {
        this.setState(() => ({ restaurants }));
      });

    this.getReviews();
  }

  getReviews = () => {
    fetch('https://restaurant-reviews-node.herokuapp.com/review/latest')
      .then(res => res.json())
      .then(data => {
        this.setState(() => ({ reviews: data }));
      })
      .catch(error => console.log(error));
  }

  removeActiveUser = () => {
    this.setState(() => ({ activeUser: [] }));
    localStorage.removeItem('token');
  }


  checkAuthenticated = () => {
    fetch('https://restaurant-reviews-node.herokuapp.com/user/validate', {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem('token')
      },
    })
      .then(res => res.json())
      .then(data => {
        this.setState(() => ({ activeUser: data }));
        console.log('App')
      })
      .catch(error => console.log(error));
  }

  render() {
    const appData = {
      name: 'Restaurant Reviewers'
    }
    return (
      <Router>
        <div className="App">
          <Nav name={appData.name} user={this.state.activeUser} logoutUser={this.removeActiveUser} />
          <Container>
            <Switch>
              <Route path="/" exact render={(props) => <Home
                {...props}
                restaurants={this.state.restaurants}
                reviews={this.state.reviews} />} />
              <Route path="/restaurant/:id" component={RestaurantDetails} />
              <Route path="/restaurant" render={(props) => <MyRestaurant {...props} owner={this.state.activeUser} />} />
              <Route path="/review" render={(props) => <MyReview {...props} user={this.state.activeUser} owner={this.state.activeUser} getReviews={this.getReviews}/>} />
              <Route path="/login" render={(props) => <Login {...props} checkAuthenticated={this.checkAuthenticated} />} />
              <Route path="/profile" component={Home} />
              <Route path="/dashboard" component={Home} />
            </Switch>
          </Container>
        </div>
      </Router>
    );
  }
}

export default App;
