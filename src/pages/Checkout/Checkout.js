import React, { useContext } from "react";
import OrderContext from "../../OrderProvider";
import { CheckoutItems } from "../../components";
import css from "./Checkout.module.scss";
import classnames from "classnames";
import { getItemsQuantity, getAmount } from "../../helpers/checkout";

const Checkout = (props) => {
  const {
    state: { order },
  } = useContext(OrderContext);
  const items = Object.values(order || {});
  const itemQuantity = getItemsQuantity(order);
  const total = getAmount(order);

  return (
    <div className={classnames("container", css.checkoutWrapper)}>
      <header className={classnames("row", css.header)}>
        <div className="col-6">
          <h3>Cart</h3>
        </div>
        <div className="col-4">
          <span>{`${itemQuantity} items`}</span>
        </div>
        <div className="col-2">
          <div className={css.close} onClick={props.handleClose}>
            <i className="fa fa-times-circle" aria-hidden="true"></i>
          </div>
        </div>
      </header>
      <CheckoutItems items={items} />
      <div className={classnames(css.order, "row")}>
        <div className="col-9">
          <h6>Subtotal</h6>
        </div>
        <div className="col-3">
          <span className={css.subtotal}>Rs. {total}</span>
        </div>
      </div>
      <div className={css.checkout}>
        <button onClick={props.handleCheckout}>Checkout</button>
      </div>
    </div>
  );
};

export default Checkout;
