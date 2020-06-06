import React, { useState, useEffect, useContext } from "react";
import classnames from "classnames";
import { Loader } from "../../components";
import { getAmount } from "../../helpers/checkout";
import css from "./Confirmation.module.scss";
import OrderContext from "../../OrderProvider";

const Confirmation = () => {
  const [isLoading, toggleIsLoading] = useState(true);
  const {
    state: { order },
  } = useContext(OrderContext);
  const total = getAmount(order);

  async function placeOrder() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(toggleIsLoading(false));
      }, 5000);
    });
  }

  useEffect(() => {
    async function getData() {
      await placeOrder();
    }
    getData();
  }, []);

  if (isLoading) {
    return <Loader text="Placing your order please wait..." />;
  } else {
    return (
      <div className={classnames("container-fluid")}>
        <div className={classnames("row", css.wrapper)}>
          <div className={classnames("col-md-8 col-sm-12 my-auto")}>
            <div className={css.confirm} />
          </div>
          <div className={classnames("col-md-4 col-sm-12 my-auto")}>
            <div className={css.orderDetails}>
              <h2>Tasty Food Enroute!</h2>
              <h4>
                Please pay the delivery agent <span>Rs {total}</span>{" "}
              </h4>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default Confirmation;
