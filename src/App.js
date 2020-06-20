import React, { useReducer } from "react";
import { Home, Restaurant, Checkout, Confirmation } from "./pages";
import { NavBar } from "./components";
import Context from "./ContextProvider";
import { Route, Switch } from "react-router-dom";

if (process.env.NODE_ENV !== "production") {
  const { whyDidYouUpdate } = require("why-did-you-update");
  whyDidYouUpdate(React);
}

const App = (props) => {
  const initialState = {
    order: {},
    isCheckoutOpen: false,
  };

  let reducer = (state = initialState, action) => {
    switch (action.type) {
      case "checkout": {
        return { ...state, order: action.payload };
      }
      case "toggleCheckout": {
        return { ...state, isCheckoutOpen: action.payload };
      }
      case "resetApp": {
        return { ...initialState };
      }
      default:
        return state;
    }
  };

  let [state, dispatch] = useReducer(reducer, initialState);

  let ContextValue = { state, dispatch };
  return (
    <Context.Provider value={ContextValue}>
      <NavBar />
      <main>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/restaurants/:restaurant_id" component={Restaurant} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/confirm" component={Confirmation} />
        </Switch>
      </main>
    </Context.Provider>
  );
};

export default React.memo(App);
