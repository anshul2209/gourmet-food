import React, { useState, useEffect, useContext } from "react";
import { Switch, Route } from "react-router-dom";
import { MenuCategory, CheckoutItems, Loader } from "../../components";
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
  const {
    state: { order, isCheckoutOpen },
    dispatch,
  } = useContext(OrderContext);
  const items = Object.values(order || {});
  const itemsNumber = getItemsQuantity(order);
  const amount = getAmount(order);

  const [menuItems, setmenuItems] = useState([]);
  const [isMenuShown, toggleMenuShown] = useState(false);
  const [isMenuLoading, toggleMenuLoading] = useState(true);

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

  const { name, url, featured_image, user_rating } = restaurant;
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
      toggleMenuLoading(!isMenuLoading);
    }
  };

  useEffect(() => {
    async function fetchData() {
      await loadDailyMenu();
    }
    fetchData();
  }, []);

  // Functions
  const handleCategorySelect = (event) => {
    toggleMenuShown(!isMenuShown);
    const id = event.target.id;

    if (id && refs[id]) {
      refs[id].current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

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

  const handleCheckout = () => {
    props.history.push("/confirm");
  };

  const handleClose = () => {
    dispatch({ type: "toggleCheckout", payload: !isCheckoutOpen });
  };

  // Local Styles
  const ratingStyle = {
    background: `#${user_rating?.rating_color}`,
    padding: "5px",
    margin: "5px 0px",
    width: "fit-content",
  };
  const featuredDivStyle = {
    backgroundImage: `url(${featured_image})`,
    backgroundSize: "contain",
  };

  const showCheckout = isCheckoutOpen && !!itemsNumber;

  if (isMenuLoading) {
    return <Loader text="Loading..." />;
  }
  return (
    <React.Fragment>
      <div className={classnames("container-fluid", css.restaurantWrapper)}>
        <div className={classnames("row")}>
          <div className={classnames(showCheckout ? "col-md-9" : "col-12")}>
            <div className={classnames("row")}>
              <div className="col-sm-12">
                <div className={css.background} style={featuredDivStyle} />
              </div>
            </div>
            <div className={classnames("row", css.details)}>
              <div className={classnames("col-12")}>
                <div className="row">
                  <div className="col-10">
                    <div className={css.name}>{name}</div>
                  </div>
                  <div className="col-2">
                    <div style={ratingStyle}>
                      {user_rating?.aggregate_rating}
                    </div>
                    <div>{user_rating?.rating_text}</div>
                  </div>
                </div>
              </div>
              <div className={classnames("col-12")}>
                <div className="row">
                  <div className="col-12">
                    <div className={css.cusines}>{restaurant.cuisines}</div>
                  </div>
                  <div className="col-12">
                    <div className={css.address}>
                      {restaurant.location.address}
                    </div>
                  </div>
                  <div className="col-12">
                    <div className={css.timing}>{restaurant.timings}</div>
                  </div>
                </div>
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
                      <div
                        className={css.item}
                        key={item.menu.id}
                        id={item.menu.id}
                      >
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
                        <h4 ref={refs[item.menu.id]}>{item.menu.name}</h4>
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
          <div className={classnames(showCheckout ? "col-md-3" : "d-none")}>
            <div className={css.checkout}>
              <Checkout
                handleCheckout={handleCheckout}
                handleClose={handleClose}
              />
            </div>
          </div>
        </div>
      </div>
      <div className={classnames(css.bottomBar, "d-sm-block d-md-none")}>
        <div className={css.menuWrapper}>
          {isMenuShown && (
            <div className={css.categories} onClick={handleCategorySelect}>
              {menuItems.map((item) => {
                return (
                  <div
                    className={css.item}
                    key={item.menu.id}
                    id={item.menu.id}
                  >
                    {item.menu.name}
                  </div>
                );
              })}
            </div>
          )}

          <button onClick={() => toggleMenuShown(!isMenuShown)}>
            <i className="fas fa-bars"></i>
            Menu
          </button>
        </div>
        {!!itemsNumber && (
          <div className={css.checkoutBar}>
            {isCheckoutOpen && (
              <div className={css.checkout}>
                <CheckoutItems items={items} />
              </div>
            )}
            <div className={css.itemDetails}>
              <span
                className={css.quantity}
                onClick={handleClose}
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
