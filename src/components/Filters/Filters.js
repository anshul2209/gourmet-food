import React from "react";
import css from "./Filters.module.scss";
import classnames from "classnames";

const ratings = [2, 3, 4, 5];
const cost = [100, 200, 500, 1000];
export default class Filters extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      rating: 0,
      cost: 1000,
      cusine: "",
    };
  }
  handleFilter = (event) => {
    this.setState(
      {
        [event.target.name]: event.target.value,
      },
      () => {
        this.props.handleQuery(this.state);
      }
    );
  };
  render() {
    const { cusineList } = this.props;
    return (
      <div className={classnames(css.wrap)}>
        <div className={classnames(css.cusineFilter)}>
          <h4>Cost For Two</h4>
          <div onChange={this.handleFilter}>
            {cost.map((item) => {
              return (
                <div className="form-check" key={item}>
                  <label className="form-check-label">
                    <input
                      type="radio"
                      value={parseInt(item, 10)}
                      className="form-check-input"
                      name="cost"
                    />
                    Upto: Rs {item}
                  </label>
                </div>
              );
            })}
          </div>
        </div>
        <div className={classnames(css.cusineFilter)}>
          <h4>Ratings</h4>
          <div
            className={classnames(css.cusineFilter)}
            onChange={this.handleFilter}
          >
            {ratings.map((rating) => {
              return (
                <div className="form-check" key={rating}>
                  <label className="form-check-label">
                    <input
                      type="radio"
                      value={parseInt(rating, 10)}
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
          <div
            className={classnames(css.cusineFilter)}
            onChange={this.handleFilter}
          >
            {cusineList.map((cusine) => {
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
  }
}
