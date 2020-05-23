import React, { Component } from 'react';
import { RestaurantTile, Loader, Animate } from '../../components';
import axios from 'axios';
import { restraunts_url } from '../../config';

class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			restaurantList: [],
			isLoading: true
		}
	}
	componentDidMount() {
		this.loadRestaurants();
	}

	loadRestaurants = async () => {
		const headers = {
			'user-key': process.env.REACT_APP_USER_KEY
		}
		const response = await axios.get(restraunts_url, { headers })
			.catch(err => console.error(`axios error is ${err.message}`));

		response && this.setState({
			restaurantList: response.data.restaurants,
			isLoading: false
		});
	}

	handleRestaurantClick = restaurant => {
		this.props.history.push({ 
			pathname: `/restaurants/${restaurant.id}`,
			state: { restaurant }
		})
	}
	render() {
		const { restaurantList, isLoading } = this.state;
		const isRestaurantAvailable = !!(restaurantList && restaurantList.length && !isLoading);

		return (
			<React.Fragment>
				{isLoading && <Loader text="Restaurant Loading..." />}
				<div className="container">
					<div className="row">
						{
							restaurantList.map(restaurantObj => {
								return (
									<div className="col-md-4 col-sm-12" key={restaurantObj.restaurant.id}>
										<Animate in={isRestaurantAvailable}>
											<RestaurantTile 
												restaurant={restaurantObj.restaurant}
												onClick={this.handleRestaurantClick}
											/>
										</Animate>
									</div>
								)
							})
						}
					</div>
				</div>
			</React.Fragment >
		)
	}
}

export default Home;