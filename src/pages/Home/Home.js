import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { RestaurantTile, Loader, Animate, Filters } from "../../components";
import { apiEndpoint } from "../../config";
import { host_url } from "../../config";

import css from "./Home.module.scss";
import classnames from "classnames";

let allRestaurants = [];

const Home = (props) => {
  // Handle Data Fetching
  const [restaurantList, setRestaurantsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`${apiEndpoint}/api/allrestaurants`);

      if (response) {
        allRestaurants = [].concat(
          response.data.restaurants.filter(
            (item) => !!item.restaurant.has_online_delivery
          )
        );
        console.log({ allRestaurants });
        const restaurantList = [...allRestaurants];

        setRestaurantsList(restaurantList);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle Filtering
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [applyFilterVisible, setFilterVisible] = useState(false);
  const handleFilter = (query) => {
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

    setRestaurantsList(restaurants);
    setFilterVisible(true);
  };

  const toggleFilter = () => {
    setFilterOpen(!isFilterOpen);
    setFilterVisible(false);
  };
  const isRestaurantAvailable = !!(
    restaurantList &&
    restaurantList.length &&
    !isLoading
  );

  // Handle Routing to Restaurant Detail
  const handleRestaurantClick = (restaurant) => {
    const temp_path = restaurant.url.split("?")[0].split(host_url);
    const restaurantDetailUrl = temp_path[1];

    props.history.push(`/restaurants/${restaurant.id}`);
  };

  // Handle Total Count of Restaurants
  const [totalRestaurantCount, setRestaurantsCount] = useState(0); // called on didmount and diupdate
  useEffect(() => {
    setRestaurantsCount(restaurantList.length);
  }, [restaurantList]);

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
                restaurantList={restaurantList}
                handleQuery={handleFilter}
              />
            </div>
          </div>
          {isFilterOpen && (
            <div className="col-md-2 col-sm-12 d-sm-block d-md-none">
              <div className={classnames("", css.filter_mobile)}>
                <div className={css.close} onClick={toggleFilter}>
                  <i className="fa fa-times-circle" aria-hidden="true"></i>
                </div>
                <Filters
                  restaurantList={restaurantList}
                  handleQuery={handleFilter}
                />
                {applyFilterVisible && (
                  <div
                    className={classnames("bg-info", css.apply)}
                    onClick={toggleFilter}
                  >
                    Apply
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="col-md-10 col-sm-12">
            <div className="row">
              <div className="col-12">
                <h4>Total Restaurants are {totalRestaurantCount}</h4>
              </div>
            </div>
            <div className="row">
              {restaurantList.map((restaurantObj) => {
                return (
                  <div
                    className="col-md-4 col-sm-12 mb-4"
                    key={restaurantObj.restaurant.id}
                  >
                    <Animate in={isRestaurantAvailable}>
                      <RestaurantTile
                        restaurant={restaurantObj.restaurant}
                        onClick={handleRestaurantClick}
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
            className={classnames("d-sm-block d-md-none", css.stickyFilter)}
            onClick={toggleFilter}
          >
            <span>FILTER</span>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default Home;
