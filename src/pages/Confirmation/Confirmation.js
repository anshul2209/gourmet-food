import React, { useState, useEffect, useContext } from "react";
import classnames from "classnames";
import { Loader } from "../../components";
import { getAmount } from "../../helpers/checkout";
import css from "./Confirmation.module.scss";
import Context from "../../ContextProvider";

const Confirmation = () => {
  const [isLoading, toggleIsLoading] = useState(true);
  const {
    state: { order },
    dispatch,
  } = useContext(Context);

  useEffect(() => {
    async function getData() {
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(toggleIsLoading(false));
        }, 5000);
      });
    }
    getData();
  }, []);

  const [total, setTotal] = useState(0);
  useEffect(() => {
    setTotal(getAmount(order));
    dispatch({ type: "resetApp" });
  }, []);

  if (isLoading) {
    return <Loader text="Placing your order please wait..." />;
  } else {
    return (
      <div className={classnames("container-fluid")}>
        <div className={classnames("row", css.wrapper)}>
          <div className={classnames("col-md-8 col-sm-12")}>
            <div className={css.confirm} />
          </div>
          <div className={classnames("col-md-4 col-sm-12s")}>
            <div className={css.orderDetails}>
              <h1>Tasty Food Enroute...</h1>
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

export default React.memo(Confirmation);
