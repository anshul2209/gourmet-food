import React from "react";
import "./RestaurantTile.scss";
import food_image_placeholder from "../../foodplaceholder.png";

const RestaurantTile = (props) => {
  const handleClick = (restaurant) => () => {
    props.onClick && props.onClick(restaurant);
  };
  const { restaurant } = props;
  const style = {
    background: `#${restaurant?.user_rating?.rating_color}`,
    padding: "5px",
  };

  return (
    <div className="tile" onClick={handleClick(restaurant)}>
      <img
        src={restaurant.thumb || food_image_placeholder}
        alt="restraunt_pic"
      />
      <div className="details">
        <p className="name">{restaurant.name}</p>
        <p className="cuisnes">{restaurant.cuisines}</p>
        <div className="cost">
          <p style={style}>{restaurant?.user_rating?.aggregate_rating}</p>
          <p>
            Cost for two:{" "}
            {`${restaurant.currency} ${restaurant.average_cost_for_two}`}
          </p>
        </div>
        <p className="timings">{restaurant.timings}</p>
      </div>
    </div>
  );
};

export default RestaurantTile;
