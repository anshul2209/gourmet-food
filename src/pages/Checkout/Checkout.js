import React, { useContext } from "react";
import OrderContext from "../../OrderProvider";
import css from "./Checkout.module.scss";
import classnames from "classnames";

const Checkout = (props) => {
  const { state } = useContext(OrderContext);
  const items = Object.values(state.order || {})
  const add = (acc, current) => acc + current;
  const itemQuantity = items.map((item) => item.quantity).reduce(add, 0);
  const total = parseInt(
    items.map((item) => item.price * item.quantity).reduce(add, 0),
    10
  );

  return (
    <div className={classnames("container", css.checkoutWrapper)}>
      <header className={classnames("row", css.header)}>
        <div className="col-6">
          <h2>Cart</h2>
        </div>
        <div className="col-6">
          <span>{`${itemQuantity} items`}</span>
        </div>
      </header>
      <section className={css.orderDetails}>
        {items.map((itm) => {
          const { name, quantity, price } = itm;
          return (
            <div className={classnames("row", css.order)}>
              <div className="col-10">
                <span className={css.name}>{name}</span>
              </div>
              <div className="col-2">
                <span className={css.quantity}>{quantity}</span>
              </div>
              <div className="col-12">
                <span className={css.price}>Rs. {price}</span>
              </div>
            </div>
          );
        })}
        <div className={classnames(css.order, "row")}>
          <div className="col-8">
            <h6>Subtotal</h6>
          </div>
          <div className="col-4">
            <span className={css.subtotal}>Rs. {total}</span>
          </div>
        </div>
      </section>
      <div className={css.checkout}>
        <button onClick={props.handleCheckout}>Checkout</button>
      </div>
    </div>
  );
};

export default Checkout;
