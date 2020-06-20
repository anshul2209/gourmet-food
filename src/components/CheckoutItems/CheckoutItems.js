import React from "react";
import css from "./CheckoutItems.module.scss";
import classnames from "classnames";

export default function CheckoutItems({ items }) {
  return (
    <section>
      {items.map((itm) => {
        const { name, quantity, price } = itm;
        if (!quantity) return null;
        return (
          <div className={classnames(css.order, "row")} key={name}>
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
    </section>
  );
}
