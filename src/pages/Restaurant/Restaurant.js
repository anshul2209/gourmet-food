import React, { useState, useEffect, useContext } from "react";
import { Switch, Route } from "react-router-dom";
import { MenuCategory, CheckoutItems } from "../../components";
import { getItemsQuantity, getAmount } from "../../helpers/checkout";
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
  const [isMenuShown, toggleMenuShown] = useState(false);
  const [isCheckoutShown, toggleCheckoutShown] = useState(false);
  const refs = menuItems
    .map((item) => item.menu)
    .reduce((acc, value) => {
      acc[value.id] = React.createRef();
      return acc;
    }, {});

  const {
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
    backgroundSize: "contain",
  };

  // eslint-disable-next-line
  useEffect(() => loadDailyMenu(), []);

  const handleCategorySelect = (event) => {
    toggleMenuShown(!isMenuShown);
    const id = event.target.id;
    refs[id].current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };
  const {
    state: { order },
    dispatch,
  } = useContext(OrderContext);

  const items = Object.values(order || {});

  const handleItemSelection = (item, action) => {
    const checkoutItems = { ...order };
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

  const itemsNumber = getItemsQuantity(order);
  const amount = getAmount(order);

  const handleCheckout = () => {
    props.history.push("/confirm");
  };

  const handleClose = () => {
    toggleCheckoutShown(!!isCheckoutShown);
  };

  const showCheckout = isCheckoutShown && !!itemsNumber;
  console.log(isCheckoutShown);
  return (
    <React.Fragment>
      <div className={classnames("container-fluid", css.restaurantWrapper)}>
        <div className={classnames("row")}>
          <div className={classnames(!!itemsNumber ? "col-md-9" : "col-12")}>
            <div className={classnames("row")}>
              <div className="col-sm-12">
                <div className={css.background} style={featuredDivStyle} />
              </div>
            </div>
            <div className={classnames("row", css.details, "mb-3")}>
              <div className={classnames("col-lg-3", "col-sm-12", "my-auto")}>
                <span className={css.name}>{name}</span>
              </div>
              <div className={classnames("col-lg-1", "col-sm-6", "my-auto")}>
                <span className={css.price}>{price_range}</span>
              </div>
              <div className={classnames("col-lg-1", "col-sm-6", "my-auto")}>
                <span className={css.rating}>
                  {user_rating.aggregate_rating}
                </span>
              </div>
              <div className={classnames("col-lg-7", "col-sm-12", "my-auto")}>
                <ul className={css.highlights}>
                  {highlights.map((highlight) => {
                    return <li key={highlight}>{highlight}</li>;
                  })}
                </ul>
              </div>
            </div>
            <div className={classnames("row")}>
              <div
                className={classnames("col-md-2 col-sm-12 d-none d-sm-block")}
                onClick={handleCategorySelect}
              >
                <div className={css.categories}>
                  {menuItems.map((item) => {
                    return (
                      <div className={css.item} id={item.menu.id}>
                        {item.menu.name}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className={classnames("col-md-10 col-sm-12")}>
                <div className={css.menu}>
                  {menuItems.map((item) => {
                    return (
                      <div
                        className={classnames("col-sm-12", css.menucategory)}
                        key={item.menu.id}
                      >
                        <h5 ref={refs[item.menu.id]}>{item.menu.name}</h5>
                        <MenuCategory
                          categoryMenu={item.menu}
                          handleItemSelection={handleItemSelection}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className={classnames(!!itemsNumber ? "col-md-3" : "d-none")}>
            <div className={css.checkout}>
              <Checkout
                handleCheckout={handleCheckout}
                handleClose={handleClose}
              />
            </div>
          </div>
        </div>
      </div>
      <div className={"d-sm-block d-md-none"}>
        <div className={css.menuWrapper}>
          {isMenuShown && (
            <div className={css.categories} onClick={handleCategorySelect}>
              {menuItems.map((item) => {
                return (
                  <div className={css.item} id={item.menu.id}>
                    {item.menu.name}
                  </div>
                );
              })}
            </div>
          )}
          <button onClick={() => toggleMenuShown(!isMenuShown)}>Menu</button>
        </div>
        {!!itemsNumber && (
          <div className={css.checkoutBar}>
            {isCheckoutShown && (
              <div className={css.checkout}>
                <CheckoutItems items={items} />
              </div>
            )}
            <div className={css.itemDetails}>
              <span
                className={css.quantity}
                onClick={() => toggleCheckoutShown(!isCheckoutShown)}
              >{`${itemsNumber} Items `}</span>
              <span className={css.amount}>{`Rs ${amount} `}</span>
              <button onClick={handleCheckout}>Checkout</button>
            </div>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

const DefaultRestaurant = () => null;

export default Restaurant;
