import React, { useContext } from "react";
import css from "./NavBar.module.scss";
import logoImg from "../../images/logo.svg";
import Context from "../../ContextProvider";
import { getItemsQuantity } from "../../helpers/checkout";


const Navbar = () => {
  const {
    state: { order, isCheckoutOpen },
    dispatch
  } = useContext(Context);
  const itemQuantity = getItemsQuantity(order);

  const handleClick = () => {
   return !!itemQuantity && dispatch({ type: "toggleCheckout", payload: !isCheckoutOpen });
  }

  return (
    <nav className="navbar navbar-light bg-light sticky-top">
      <a className="navbar-brand" href="/">
        <img src={logoImg} height="50px" width="auto" alt="Gourmet" />
        Gourmet
      </a>
      <div className={css.cart} onClick={handleClick}>
        <i className="fas fa-shopping-cart"></i>
        {!!itemQuantity && <span className={css.quantity}>{itemQuantity}</span>}
      </div>
    </nav>
  );
};

export default React.memo(Navbar);
