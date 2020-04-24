import React from 'react';
import axios from 'axios';
import RestrauntTile from './components/RestrauntTile.js';
import Filters from './components/Filters.js';
import './App.css';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      allRestraunts: [],
      restaurantsList: [],
      cusineList: []
    }
    this.data = [];
  }
  componentDidMount() {
    this.loadRestraunts();
  }
  loadRestraunts = () => {
    axios.get('https://developers.zomato.com/api/v2.1/search?entity_id=1&entity_type=city', 
      { headers: { 'user-key': '38bee742336800b525c5b79659dc4fda' } 
    }).then(response => {
      const { cusineList } = this.state;
      const { restaurants } =  response.data;
      this.setState({
        allRestraunts: restaurants,
        restaurantsList: restaurants
      });
      restaurants.forEach(item => {
        return cusineList.push(...item.restaurant.cuisines.split(','))
      });

      this.getCuisines(cusineList);
    })
    .catch((error) => {
      console.log('error ' + error);
    });
  }

  filterRestraunts = event => {
    const query = event.target.value?.toLowerCase();
    const { allRestraunts } = this.state;

    const restraunts = allRestraunts.filter( item => {
      const { restaurant} = item;
      const { name, cuisines } = restaurant;

      return name.toLowerCase().includes(query) || cuisines.toLowerCase().includes(query);
    });

    this.setState({
      restaurantsList: restraunts
    });
  }
  getCuisines = cusineList => {
    function onlyUnique(value, index, self) { 
      return self.indexOf(value) === index;
    }
    // usage example:
    var unique = cusineList.filter( onlyUnique );

    this.setState({
      cusineList: unique
    })
  }

  handleFilter = query => {
    const { allRestraunts } = this.state;
    const { rating, cost, cusine } = query;

    const restraunts = allRestraunts.filter( item => {
      const { restaurant} = item;
      const { cuisines, user_rating, average_cost_for_two } = restaurant;

      return (parseInt(user_rating.aggregate_rating, 10) >= parseInt(rating, 10))
        && cuisines.toLowerCase().trim().includes(cusine.toLowerCase().trim())
        && parseInt(average_cost_for_two, 10) <= parseInt(cost, 10)
    });

    this.setState({
      restaurantsList: restraunts
    });
  }

  render() {
    const { restaurantsList, cusineList } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <div className="container">
            <div className="search row">
              <input className="form-control" type="text" onChange = { this.filterRestraunts} placeholder="Search For Restaurant or Cusine" aria-label="Search" />
            </div>
            
          </div>
          <div className="container">
            <div className="row">
              <Filters cusineList={cusineList} handleQuery ={this.handleFilter}/>
            </div>
          </div>
          <div className="container listWrapper">
            <div className="row row-eq-height">
            {
              restaurantsList.map(item => {
                this.data.push(...item.restaurant.cuisines.split(','))
                return (
                  <div className="col-md-4 col-xs-12" key={item.restaurant.id}>
                    <RestrauntTile restaurant={item.restaurant} />
                  </div>
                )
              })
            }
            </div>
          </div>
        </header>
      </div>
    );
  }
}