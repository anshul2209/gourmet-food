import React from "react";
import { useEffect, useState } from "react";
import css from "./Filters.module.scss";
import classnames from "classnames";

const ratingsValues = [2, 3, 4, 5];
const costValues = [500, 1000, 2000, 3000, 4000];

const Filters = ({ restaurantList, handleQuery }) => {
  const [cusines, setcuisine] = useState([]);
  // componentDidMount
  useEffect(() => {
    const cusineList = restaurantList.map(
      (rest) => rest.restaurant.cuisines.split(", ") // get array of arrays
    );

    const uniqueCuisines = [...new Set([].concat(...cusineList))];
    setcuisine(uniqueCuisines);
  }, []);

  const [filters, setFilters] = useState({
    rating: 1,
    cost: 4000,
    cusine: " ",
  });
  // componentDidUpdate
  useEffect(() => {
    handleQuery(filters);
  }, [filters]);

  const handleFilter = (event) => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <div className={classnames(css.wrap)}>
      <div className={classnames(css.cusineFilter)}>
        <h4>Cost For Two</h4>
        <div onChange={handleFilter}>
          {costValues.map((cost) => {
            return (
              <div className="form-check" key={cost}>
                <label className="form-check-label">
                  <input
                    type="radio"
                    value={cost}
                    className="form-check-input"
                    name="cost"
                  />
                  Upto: Rs {cost}
                </label>
              </div>
            );
          })}
        </div>
      </div>
      <div className={classnames(css.cusineFilter)}>
        <h4>Ratings</h4>
        <div className={classnames(css.cusineFilter)} onChange={handleFilter}>
          {ratingsValues.map((rating) => {
            return (
              <div className="form-check" key={rating}>
                <label className="form-check-label">
                  <input
                    type="radio"
                    value={rating}
                    className="form-check-input"
                    name="rating"
                  />
                  {rating}* and above
                </label>
              </div>
            );
          })}
        </div>
      </div>
      <div className={classnames(css.cusineFilter)}>
        <h4>Cuisines</h4>
        <div className={classnames(css.cusineFilter)} onChange={handleFilter}>
          {cusines.map((cusine) => {
            return (
              <div className="form-check" key={cusine}>
                <label className="form-check-label">
                  <input
                    type="radio"
                    value={cusine.trim()}
                    className="form-check-input"
                    name="cusine"
                  />
                  {cusine}
                </label>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default React.memo(Filters);
