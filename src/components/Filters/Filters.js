import React from "react";
import { useEffect, useState } from "react";
import css from "./Filters.module.scss";
import classnames from "classnames";

const ratingsValues = [2, 3, 4, 5];
const costValues = [100, 200, 500, 1000];

// const Filters = ({ restaurantList, handleQuery }) => {
//   const [cusines, setcuisine] = useState([]);
//   // componentDidMount
//   useEffect(() => {
//     const cusineList = restaurantList.map(
//       (rest) => rest.restaurant.cuisines.split(", ") // get array of arrays
//     );

//     const uniqueCuisines = [...new Set([].concat(...cusineList))];
//     setcuisine(uniqueCuisines);
//   }, []);

//   const [filters, setFilters] = useState({
//     rating: 0,
//     cost: 1000,
//     cusine: "",
//   });
//   // componentDidUpdate
//   useEffect(() => {
//     handleQuery(filters);

//     return () => console.log("Cleanup. ComponentWillunmount called"); // componentwillunmount
//   }, [filters]);

//   const handleFilter = (event) => {
//     console.log(event.target.value);
//     setFilters({
//       ...filters,
//       [event.target.name]: event.target.value,
//     });
//   };

//   return (
//     <div className={classnames(css.wrap)}>
//       <div className={classnames(css.cusineFilter)}>
//         <h4>Cost For Two</h4>
//         <div onChange={handleFilter}>
//           {costValues.map((cost) => {
//             return (
//               <div className="form-check" key={cost}>
//                 <label className="form-check-label">
//                   <input
//                     type="radio"
//                     value={cost}
//                     className="form-check-input"
//                     name="cost"
//                   />
//                   Upto: Rs {cost}
//                 </label>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//       <div className={classnames(css.cusineFilter)}>
//         <h4>Ratings</h4>
//         <div className={classnames(css.cusineFilter)} onChange={handleFilter}>
//           {ratingsValues.map((rating) => {
//             return (
//               <div className="form-check" key={rating}>
//                 <label className="form-check-label">
//                   <input
//                     type="radio"
//                     value={rating}
//                     className="form-check-input"
//                     name="rating"
//                   />
//                   {rating}* and above
//                 </label>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//       <div className={classnames(css.cusineFilter)}>
//         <h4>Cuisines</h4>
//         <div className={classnames(css.cusineFilter)} onChange={handleFilter}>
//           {cusines.map((cusine) => {
//             return (
//               <div className="form-check" key={cusine}>
//                 <label className="form-check-label">
//                   <input
//                     type="radio"
//                     value={cusine.trim()}
//                     className="form-check-input"
//                     name="cusine"
//                   />
//                   {cusine}
//                 </label>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// };

class Filters extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filters: {
        rating: 0,
        cost: 1000,
        cusine: "",
      },
      cusines: [],
    };
  }

  componentDidMount() {
    const cusineList = this.props.restaurantList.map(
      (rest) => rest.restaurant.cuisines.split(", ") // get array of arrays
    );
    const cusines = [...new Set([].concat(...cusineList))];

    this.setState({
      cusines,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.filters != prevState.filters) {
      this.props.handleQuery(this.state.filters);
    }
  }

  handleFilter = (event) => {
    const { filters } = this.state;
    const filterscopy = { ...filters };
    filterscopy[event.target.name] = event.target.value;

    this.setState({
      filters: filterscopy,
    });
  };

  render() {
    const { cusines } = this.state;

    return (
      <div className={classnames(css.wrap)}>
        <div className={classnames(css.cusineFilter)}>
          <h4>Cost For Two</h4>
          <div onChange={this.handleFilter}>
            {costValues.map((item) => {
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
            {ratingsValues.map((rating) => {
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
  }
}

export default Filters;
