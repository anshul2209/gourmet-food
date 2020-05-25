import React, { Component } from "react";
import { RestaurantTile, Loader, Animate, Filters } from "../../components";
import axios from "axios";
import { restraunts_url } from "../../config";
import css from "./Home.module.scss";
import classnames from "classnames";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allRestaurants: [],
      restaurantList: [],
      isLoading: true,
      cuisineList: [],
      isFilterOpen: false,
      applyFilterVisible: false,
    };
  }
  componentDidMount() {
    this.loadRestaurants();
  }

  loadRestaurants = async () => {
    const headers = {
      "user-key": process.env.REACT_APP_USER_KEY,
    };
    const response = await axios
      .get(restraunts_url, { headers })
      .catch((err) => console.error(`axios error is ${err.message}`));

    if (response) {
      const restaurantList = response.data.restaurants;
      const cuisineList = restaurantList.map(
        (rest) => rest.restaurant.cuisines.split(", ") // get array of arrays
      );

      this.setState({
        allRestaurants: restaurantList,
        restaurantList,
        isLoading: false,
        cusineList: [...new Set([].concat(...cuisineList))], // flatten array of arrays
      });
    }
  };

  handleRestaurantClick = (restaurant) => {
    this.props.history.push({
      pathname: `/restaurants/${restaurant.id}`,
      state: { restaurant },
    });
  };

  handleFilter = (query) => {
    const { allRestaurants } = this.state;
    const { rating, cost, cusine } = query;

    const restaurants = allRestaurants.filter((item) => {
      const { restaurant } = item;
      const { cuisines, user_rating, average_cost_for_two } = restaurant;
      return (
        parseInt(user_rating.aggregate_rating, 10) >= parseInt(rating, 10) &&
        cuisines.toLowerCase().trim().includes(cusine.toLowerCase().trim()) &&
        parseInt(average_cost_for_two, 10) <= parseInt(cost, 10)
      );
    });

    this.setState({
      restaurantList: restaurants,
      applyFilterVisible: true,
    });
  };

  toggleFilter = () => {
    this.setState((prevState) => ({
      isFilterOpen: !prevState.isFilterOpen,
      applyFilterVisible: false,
    }));
  };

  render() {
    const {
      restaurantList,
      isLoading,
      cusineList,
      isFilterOpen,
      applyFilterVisible,
    } = this.state;

    const isRestaurantAvailable = !!(
      restaurantList &&
      restaurantList.length &&
      !isLoading
    );

    if (isLoading) {
      return <Loader text="Restaurant Loading..." />;
    }
    return (
      <React.Fragment>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-2 col-sm-12">
              <div
                className={classnames("d-none d-sm-block", css.filter_desktop)}
              >
                <Filters
                  cusineList={cusineList}
                  handleQuery={this.handleFilter}
                />
              </div>
            </div>
            {isFilterOpen && (
              <div className="col-md-2 col-sm-12 d-sm-block d-md-none">
                <div className={classnames("", css.filter_mobile)}>
                  <div className={css.close} onClick={this.toggleFilter}>
                    Close
                  </div>
                  <Filters
                    cusineList={cusineList}
                    handleQuery={this.handleFilter}
                  />
                  {applyFilterVisible && (
                    <div
                      className={classnames("bg-info", css.apply)}
                      onClick={this.toggleFilter}
                    >
                      Apply
                    </div>
                  )}
                </div>
              </div>
            )}
            <div className="col-md-10 col-sm-12">
              <div className="row">
                {restaurantList.map((restaurantObj) => {
                  return (
                    <div
                      className="col-md-3 col-sm-12 mb-3"
                      key={restaurantObj.restaurant.id}
                    >
                      <Animate in={isRestaurantAvailable}>
                        <RestaurantTile
                          restaurant={restaurantObj.restaurant}
                          onClick={this.handleRestaurantClick}
                        />
                      </Animate>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          {!isFilterOpen && (
            <div
              className={classnames(
                "d-sm-block d-md-none bg-info",
                css.stickyFilter
              )}
              onClick={this.toggleFilter}
            >
              <spna>FILTER</spna>
            </div>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default Home;
