import React, { useState, useEffect, useContext } from "react";
import { MenuCategory, CheckoutItems, Loader } from "../../components";
import { getItemsQuantity, getAmount } from "../../helpers/checkout";
import axios from "axios";
import { apiEndpoint } from "../../config";
import classnames from "classnames";
import Context from "../../ContextProvider";
import Checkout from "../Checkout/Checkout";

import css from "./Restaurant.module.scss";

const Restaurant = (props) => {
  const {
    state: { order, isCheckoutOpen },
    dispatch,
  } = useContext(Context);
  const items = Object.values(order || {});
  const itemsNumber = getItemsQuantity(order);
  const amount = getAmount(order);

  const [menuItems, setmenuItems] = useState([]);
  const [isMenuShown, toggleMenuShown] = useState(false);
  const [isMenuLoading, toggleMenuLoading] = useState(true);
  const [restaurant, setRestaurant] = useState({
    cuisines: "",
    name: "",
    user_rating: {},
    timing: {},
    location: {},
    o2_featured_image: "",
  });

  const refs = menuItems
    .map((item) => item.menu_id)
    .reduce((acc, value) => {
      acc[value] = React.createRef();
      return acc;
    }, {});

  const {
    match: {
      params: { region, name, restaurant_id },
    },
  } = props;

  const loadDailyMenu = async () => {
    const response = await axios
      .get(
        `${apiEndpoint}/api/restaurant?region=${region}&name=${name}&restaurant_id=${restaurant_id}`
      )
      .catch((err) => console.error(`axios error is ${err.message}`));

    if (response) {
      const {
        data: { menus, restaurant_info },
      } = response;

      const {
        cuisines,
        name,
        user_rating,
        timing,
        o2_featured_image,
        location,
      } = restaurant_info;
      setRestaurant({
        cuisines,
        name,
        user_rating,
        timing,
        location,
        o2_featured_image,
      });
      console.log({menus});
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
        block: "center",
      });
    }
  };

  const handleItemSelection = (item, action) => {
    const checkoutItems = { ...order };
    const orderItem = checkoutItems[item.item_id];

    if (orderItem) {
      const quantity =
        action === "remove"
          ? Math.max(0, orderItem.quantity - 1)
          : orderItem.quantity + 1;

      checkoutItems[item.item_id].quantity = quantity;
    } else {
      const { item_id, name, price, min_price } = item;

      checkoutItems[item.item_id] = {
        item_id,
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
    background: `#${restaurant.user_rating?.rating_color}`,
    padding: "5px",
    margin: "5px 0px",
    width: "fit-content",
  };
  const featuredDivStyle = {
    backgroundImage: `url(${restaurant.o2_featured_image})`,
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
                    <div className={css.name}>{restaurant.name}</div>
                  </div>
                  <div className="col-2">
                    <div style={ratingStyle}>
                      {restaurant.user_rating?.aggregate_rating}
                    </div>
                    <div>{restaurant.user_rating?.rating_text}</div>
                  </div>
                </div>
              </div>
              <div className={classnames("col-12")}>
                <div className="row">
                  <div className="col-12">
                    <div className={css.cusines}>{restaurant.cuisines}</div>
                  </div>
                  <div className="col-12">
                    <div className={css.location}>
                      {restaurant.location.locality}
                    </div>
                  </div>
                  <div className="col-12">
                    <div className={css.timing}>
                      {restaurant.timing?.timing_desc}
                    </div>
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
                        key={item.menu_id}
                        id={item.menu_id}
                      >
                        {item.name}
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
                        key={item.menu_id}
                      >
                        <h4 ref={refs[item.menu_id]}>{item.name}</h4>
                        <MenuCategory
                          categoryMenu={item.categories}
                          handleItemSelection={handleItemSelection}
                          id={item.menu_id}
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
                    key={item.menu_id}
                    id={item.menu_id}
                  >
                    {item.name}
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
          <div className={classnames(css.checkoutBar)}>
            {isCheckoutOpen && (
              <div className={classnames("container-fluid", css.checkout)}>
                <div className={classnames("row", css.checkoutHeader)}>
                  <div className={"col-10"}>
                    <h3>Your Orders</h3>
                  </div>
                  <div className={"col-2"}>
                    <span>Close</span>
                  </div>
                </div>
                <CheckoutItems items={items} />
              </div>
            )}
            <div className={"container-fluid"}>
              <div className={classnames("row", css.itemDetails)}>
                <div className="col-4">
                  <div className={css.quantity}>
                    <span onClick={handleClose}>{`${itemsNumber} Items `}</span>
                    <span>
                      <i
                        className={classnames(
                          "fas",
                          isCheckoutOpen ? "fa-sort-down" : "fa-sort-up"
                        )}
                      ></i>
                    </span>
                  </div>
                </div>
                <div className="col-4">
                  <span className={css.amount}>{`Rs ${amount} `}</span>
                </div>
                <div className="col-4">
                  <button
                    className={classnames("btn", css.checkoutBtn)}
                    onClick={handleCheckout}
                  >
                    Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default Restaurant;
