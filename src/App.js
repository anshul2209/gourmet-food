import React, { useReducer } from "react";
import { Home, Restaurant, Checkout, Confirmation } from "./pages";
import OrderContext from "./OrderProvider";
import { Route, Switch } from "react-router-dom";
import logoImg from "./logo.svg";

const App = () => {
  const initialState = {
    order: {},
  };

  let reducer = (state = initialState, action) => {
    switch (action.type) {
      case "checkout": {
        return { ...state, order: action.payload };
      }
      default:
        return state;
    }
  };

  let [state, dispatch] = useReducer(reducer, initialState);

  let OrderContextValue = { state, dispatch };
  return (
    <OrderContext.Provider value={OrderContextValue}>
      <nav className="navbar navbar-light bg-light sticky-top">
        <a className="navbar-brand" href="/">
          <img src={logoImg} height="50px" width="auto" alt="Gourmet" />
          Gourmet
        </a>
      </nav>
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
