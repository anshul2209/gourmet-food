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
      <div className={css.close} onClick={props.handleClose}>
        Close
      </div>
      <header className={classnames("row", css.header)}>
        <div className="col-6">
          <h2>Cart</h2>
        </div>
        <div className="col-6">
          <span>{`${itemQuantity} items`}</span>
        </div>
      </header>
      <CheckoutItems items={items} />
      <div className={classnames(css.order, "row")}>
        <div className="col-8">
          <h6>Subtotal</h6>
        </div>
        <div className="col-4">
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
