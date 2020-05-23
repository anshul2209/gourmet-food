import React, { useReducer } from "react";
import { Home, Restaurant, Checkout, Confirmation } from "./pages";
import OrderContext from "./OrderProvider";

// import RestaurantTile from './components/RestaurantTile/RestaurantTile.js';
// import Filters from './components/Filters/Filters.js';

// export default class App extends React.Component {
//   constructor() {
//     super();
//     this.state = {
//       allRestaurants: [],
//       restaurantsList: [],
//       cusineList: []
//     }
//     this.data = [];
//   }
//   componentDidMount() {
//     this.loadRestaurants();
//   }

//   filterRestaurants = event => {
//     const query = event.target.value?.toLowerCase();
//     const { allRestaurants } = this.state;

//     const restaurants = allRestaurants.filter( item => {
//       const { restaurant} = item;
//       const { name, cuisines } = restaurant;

//       return name.toLowerCase().includes(query) || cuisines.toLowerCase().includes(query);
//     });

//     this.setState({
//       restaurantsList: restaurants
//     });
//   }
//   getCuisines = cusineList => {
//     function onlyUnique(value, index, self) {
//       return self.indexOf(value) === index;
//     }
//     // usage example:
//     var unique = cusineList.filter( onlyUnique );

//     this.setState({
//       cusineList: unique
//     })
//   }

//   handleFilter = query => {
//     const { allRestaurants } = this.state;
//     const { rating, cost, cusine } = query;

//     const restaurants = allRestaurants.filter( item => {
//       const { restaurant} = item;
//       const { cuisines, user_rating, average_cost_for_two } = restaurant;

//       return (parseInt(user_rating.aggregate_rating, 10) >= parseInt(rating, 10))
//         && cuisines.toLowerCase().trim().includes(cusine.toLowerCase().trim())
//         && parseInt(average_cost_for_two, 10) <= parseInt(cost, 10)
//     });

//     this.setState({
//       restaurantsList: restaurants
//     });
//   }

//   render() {
//     const { restaurantsList, cusineList } = this.state;
//     return (
//       <div className="App">
//         <header className="App-header">
//           <div className="container">
//             <div className="search row">
//               <input className="form-control" type="text" onChange = { this.filterRestaurants} placeholder="Search For Restaurant or Cusine" aria-label="Search" />
//             </div>

//           </div>
//           <div className="container">
//             <div className="row">
//               <Filters cusineList={cusineList} handleQuery ={this.handleFilter}/>
//             </div>
//           </div>
//           <div className="container listWrapper">
//             <div className="row row-eq-height">
//             {
//               restaurantsList.map(item => {
//                 this.data.push(...item.restaurant.cuisines.split(','))
//                 return (
//                   <div className="col-md-4 col-sm-12" key={item.restaurant.id}>
//                     <RestaurantTile restaurant={item.restaurant} />
//                   </div>
//                 )
//               })
//             }
//             </div>
//           </div>
//         </header>
//       </div>
//     );
//   }
// }

import { Route, Switch } from "react-router-dom";

const App = () => {
  const initialState = {
    order: null,
  };

  let reducer = (state = initialState, action) => {
    switch (action.type) {
      case "checkout": {
        return { ...state, order: action.payload };
      }
    }
  };

  let [state, dispatch] = useReducer(reducer, initialState);

  let OrderContextValue = { state, dispatch };
  return (
    <OrderContext.Provider value={OrderContextValue}>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/restaurants" component={Restaurant} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/confirm" component={Confirmation} />
      </Switch>
    </OrderContext.Provider>
  );
};

export default App;
