import React, { useContext } from "react";
import css from "./MenuItem.module.scss";
import classnames from "classnames";
import OrderContext from "../../OrderProvider";

import food_image_placeholder from "../../foodplaceholder.png";

const MenuItem = (props) => {
  const {
    state: { order },
  } = useContext(OrderContext);
  const { item } = props;
  const quantity = (order && order[item.id]?.quantity) || 0;

  const handleAddClick = (item) => {
    props.handleItemSelection(item);
  };

  return (
    <div className={css.item}>
      <div className={css.image}>
        <img
          className={"img-fluid"}
          src={item.item_image_thumb_url || food_image_placeholder}
          alt="food"
        />
      </div>
      <div className={css.description}>
        <div className={css.name}>{item.name}</div>
        <div className={css.buyWrapper}>
          <span className={css.price}>Rs. {item.price || item.min_price}</span>
          <span className={css.price}>
            {quantity === 0 && (
              <button onClick={() => handleAddClick(item)}>Add</button>
            )}
            {!(quantity === 0) && (
              <div className={css.edit}>
                <span onClick={() => props.handleItemSelection(item, "remove")}>
                  <i className="fa fa-minus"></i>
                </span>
                <span>{quantity}</span>
                <span onClick={() => props.handleItemSelection(item)}>
                  <i className="fa fa-plus"></i>
                </span>
              </div>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

const MenuCategory = (props) => {
  const {
    categoryMenu: { categories, id },
  } = props;
  const {
    category: { items },
  } = categories[0];
  return (
    <div className={classnames("row", css.category)} id={id}>
      {items.map((itemObj, index) => {
        const { item } = itemObj;
        return (
          <div className="col-md-3" key={index}>
            <MenuItem
              item={item}
              handleItemSelection={props.handleItemSelection}
            />
          </div>
        );
      })}
    </div>
  );
};

export default MenuCategory;
