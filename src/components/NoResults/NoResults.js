import React from "react";
import css from "./NoResults.module.scss";

import image from "../../images/foodnotfound.jpg";

const NoResults = () => {
  return (
    <div className={css.noresults}>
      <img src={image} alt={"food not found"} />
    </div>
  );
};

export default NoResults;
