import React, { useState, useEffect, useContext } from "react";
import { Switch, Route } from "react-router-dom";
import { MenuCategory } from "../../components";
import axios from "axios";
import { host_url } from "../../config";
import classnames from "classnames";
import OrderContext from "../../OrderProvider";
import Checkout from "../Checkout/Checkout";

import css from "./Restaurant.module.scss";

const Restaurant = () => (
  <Switch>
    <Route exact path="/restaurants" component={DefaultRestaurant} />
    <Route path="/restaurants/:restaurant_id" component={RestaurantDetail} />
  </Switch>
);

const RestaurantDetail = (props) => {
  const [menuItems, setmenuItems] = useState([]);
  const {
    match: {
      params: { restaurant_id },
    },
    location: {
      state: { restaurant },
    },
  } = props;

  const {
    name,
    url,
    featured_image,
    highlights,
    price_range,
    user_rating,
  } = restaurant;
  const temp_path = url.split("?")[0].split(host_url);
  const restraunts_details_url = `${host_url}webroutes/getPage?page_url=${temp_path[1]}/order&location=&isMobile=0`;

  const loadDailyMenu = async () => {
    const response = await axios
      .get(`${restraunts_details_url}`)
      .catch((err) => console.error(`axios error is ${err.message}`));

    if (response) {
      const {
        data: {
          page_data: {
            order: {
              menuList: { menus },
            },
          },
        },
      } = response;
      setmenuItems(menus);
    }
  };
  const featuredDivStyle = {
    backgroundImage: `url(${featured_image})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
  };

  useEffect(() => {
    loadDailyMenu();
  }, []);

  const handleCategorySelect = (event) => {
    console.log(event.target.id);
  };
  const { state, dispatch } = useContext(OrderContext);

  const handleItemSelection = (item, action) => {
    const checkoutItems = { ...state.order };
    const orderItem = checkoutItems[item.id];

    if (orderItem) {
      const quantity =
        action === "remove"
          ? Math.max(0, orderItem.quantity - 1)
          : orderItem.quantity + 1;

      checkoutItems[item.id].quantity = quantity;
    } else {
      const { id, name, price, min_price } = item;

      checkoutItems[item.id] = {
        id,
        quantity: 1,
        name,
        price: price || min_price,
      };
    }

    dispatch({ type: "checkout", payload: checkoutItems });
  };

  return (
    <React.Fragment>
      <div className={classnames("container", css.restaurantWrapper)}>
        <div className={classnames("row", css.featured)}>
          <div className="col-sm-12">
            <div className={css.background} style={featuredDivStyle} />
          </div>
        </div>
        <div className={classnames("row", css.details)}>
          <div className={classnames("col-lg-3", "col-sm-12")}>
            <span className={css.name}>{name}</span>
          </div>
          <div className={classnames("col-lg-1", "col-sm-6")}>
            <span className={css.price}>{price_range}</span>
          </div>
          <div className={classnames("col-lg-1", "col-sm-6")}>
            <span className={css.rating}>{user_rating.aggregate_rating}</span>
          </div>
          <div className={classnames("col-lg-7", "col-sm-12")}>
            <ul className={css.highlights}>
              {highlights.map((highlight) => {
                return <li key={highlight}>{highlight}</li>;
              })}
            </ul>
          </div>
        </div>
        <div
          className={classnames("row", css.categories)}
          onClick={handleCategorySelect}
        >
          {menuItems.map((item) => (
            <div className={css.item} id={item.menu.id}>
              {item.menu.name}
            </div>
          ))}
        </div>
        <div className={classnames("row", css.menu)}>
          {menuItems.map((item, idx) => {
            return (
              <div className={classnames("col-sm-12")} key={idx}>
                <MenuCategory
                  categoryMenu={item.menu}
                  handleItemSelection={handleItemSelection}
                />
              </div>
            );
          })}
        </div>
      </div>
      { state.order && <div className={css.checkout}>
        <Checkout />
      </div>}
    </React.Fragment>
  );
};

const DefaultRestaurant = () => null;

export default Restaurant;
