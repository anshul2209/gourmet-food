import React, { useState, useContext, useEffect } from "react";
import { RestaurantTile, Loader, Animate, Filters } from "../../components";
import axios from "axios";
import { restraunts_url } from "../../config";
import OrderContext from "../../OrderProvider";
import { host_url } from "../../config";

import css from "./Home.module.scss";
import classnames from "classnames";

const Home = (props) => {
  let allRestaurants = [];
  const [restaurantList, setRestaurantsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cusineList, setcuisineList] = useState([]);
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [applyFilterVisible, setFilterVisible] = useState(false);

  const { dispatch } = useContext(OrderContext);

  useEffect(() => {
    async function getData() {
      await loadRestaurants();
    }
    getData();
  }, []);

  const loadRestaurants = async () => {
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

      allRestaurants = restaurantList;
      setRestaurantsList(restaurantList);
      setIsLoading(false);
      setcuisineList([...new Set([].concat(...cuisineList))]);
    }
  };

  const handleRestaurantClick = (restaurant) => {
    const temp_path = restaurant.url.split("?")[0].split(host_url);
    const restaurantDetailUrl = temp_path[1];

    props.history.push(`/restaurants/${restaurantDetailUrl}`);
    dispatch({ type: "selectRestaurant", payload: restaurant });
  };

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
              <Filters cusineList={cusineList} handleQuery={handleFilter} />
            </div>
          </div>
          {isFilterOpen && (
            <div className="col-md-2 col-sm-12 d-sm-block d-md-none">
              <div className={classnames("", css.filter_mobile)}>
                <div className={css.close} onClick={toggleFilter}>
                  <i className="fa fa-times-circle" aria-hidden="true"></i>
                </div>
                <Filters cusineList={cusineList} handleQuery={handleFilter} />
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
