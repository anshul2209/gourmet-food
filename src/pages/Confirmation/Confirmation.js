import React, { useState, useEffect, useContext } from "react";
import classnames from "classnames";
import { Loader } from "../../components";
import { getItemsQuantity } from "../../helpers/checkout";
import css from "./Confirmation.module.scss";
import OrderContext from "../../OrderProvider";

const Confirmation = () => {
  const [isLoading, toggleIsLoading] = useState(true);
  const {
    state: { order },
  } = useContext(OrderContext);
  const total = getItemsQuantity(order);

  useEffect(() => {
    const timer = setTimeout(() => {
      toggleIsLoading(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loader text="Placing your order please wait..." />;
  } else {
    return (
      <div className={classnames("container-fluid")}>
        <div className={classnames("row", css.wrapper)}>
          <div className={classnames("col-md-8 my-auto")}>
            <div className={css.confirm} />
          </div>
          <div className={classnames("col-4 my-auto")}>
            <div className={css.orderDetails}>
              <h1>Tasty Food Enroute!</h1>
              <h2>
                Please pay the delivery agent <span>Rs {total}</span>{" "}
              </h2>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default Confirmation;
