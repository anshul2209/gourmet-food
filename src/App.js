import React, { useReducer } from "react";
import { Home, Restaurant, Checkout, Confirmation } from "./pages";
import { NavBar } from "./components";
import OrderContext from "./OrderProvider";
import { Route, Switch } from "react-router-dom";

const App = () => {
  const initialState = {
    order: {},
    isCheckoutOpen: false
  };

  let reducer = (state = initialState, action) => {
    switch (action.type) {
      case "checkout": {
        return { ...state, order: action.payload };
      }
      case "toggleCheckout": {
        return { ...state, isCheckoutOpen: action.payload };
      }
      case "resetCheckout": {
        return state;
      }
      default:
        return state;
    }
  };

  let [state, dispatch] = useReducer(reducer, initialState);

  let OrderContextValue = { state, dispatch };
  return (
    <OrderContext.Provider value={OrderContextValue}>
      <NavBar />
      <main>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/restaurants" component={Restaurant} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/confirm" component={Confirmation} />
        </Switch>
      </main>

      {/* <footer className={classnames(css.footer)} /> */}
    </OrderContext.Provider>
  );
};

export default App;
