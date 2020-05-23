import React from 'react';
import './Filters.scss';

const ratings = [ 2, 3, 4, 5];
const cost = [ 100, 200, 500, 1000 ];
export default class Filters extends React.PureComponent {

    constructor() {
        super();
        this.state = { 
            rating: 0, 
            cost: 1000,
            cusine: ''
        }
    }
    handleFilter = event => {
        this.setState({
            [event.target.name] : event.target.value
        },  () => {
            this.props.handleQuery(this.state);
        })
    }
    render() {
        const { cusineList } = this.props;

        if(!cusineList?.length) {
            return null;
        }
        return(
            <div className="wrap">
            <React.Fragment>
                <h5>Cost For Two</h5>
                <div className="cusineFilter" onChange={this.handleFilter}>
                    { 
                        cost.map(item => {
                            return (
                                <div className="form-check-inline">
                                <label className="form-check-label">
                                    <input type="radio" value={parseInt(item, 10)} className="form-check-input" name="cost"/>Upto: Rs {item}
                                </label>
                                </div>
                            );
                        })
                    }
                </div>
            </React.Fragment>
            <React.Fragment>
                <h5>Ratings</h5>
                <div className="cusineFilter" onChange={this.handleFilter}>
                    { 
                        ratings.map(rating => {
                            return (
                                <div className="form-check-inline">
                                <label className="form-check-label">
                                    <input type="radio" value={parseInt(rating, 10)} className="form-check-input" name="rating"/>{rating}* and above
                                </label>
                                </div>
                            );
                        })
                    }
                </div>
            </React.Fragment>
            <React.Fragment>
                <h5>Cuisines</h5>
                <div className="cusineFilter" onChange={this.handleFilter}>
                    { 
                        cusineList.map(cusine => {
                            return (
                                <div className="form-check-inline">
                                <label className="form-check-label">
                                    <input type="radio" value={cusine.trim()} className="form-check-input" name="cusine"/>{cusine}
                                </label>
                                </div>
                            );
                        })
                    }
                </div>
            </React.Fragment>
            </div>
        )
    }
}
