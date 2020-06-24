import React, { useContext } from "react";
import css from "./MenuItem.module.scss";
import classnames from "classnames";
import Context from "../../ContextProvider";
import { sortImagewise } from "../../helpers/restaurant";

import food_image_placeholder from "../../images/foodplaceholder.png";

const MenuItem = (props) => {
  const {
    state: { order },
  } = useContext(Context);
  const { item } = props;
  const quantity = (order && order[item.item_id]?.quantity) || 0;

  const handleAddClick = (item) => {
    props.handleItemSelection(item);
  };

  return (
    <div className={css.item}>
      <div className={css.info}>
        {item.item_image_thumb_url && (
          <div className={css.image}>
            <img
              className={"img-fluid"}
              src={item.item_image_thumb_url || food_image_placeholder}
              alt="food"
            />
          </div>
        )}
        <div className={css.description}>
          <div className={css.name}>{item.name}</div>
          <div className={css.buyWrapper}>
            <span className={css.price}>
              Rs. {item.price || item.min_price}
            </span>
          </div>
        </div>
      </div>
      <div className={css.quantity}>
        {quantity === 0 && (
          <button className="btn" onClick={() => handleAddClick(item)}>
            Add +
          </button>
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
      </div>
    </div>
  );
};

const MenuCategory = (props) => {
  let items = props.categoryMenu.map((menu) => menu.items);
  items = [].concat.apply([], items);

  items = sortImagewise(items, "item_image_thumb_url");

  return (
    <div className={classnames("row", css.category)} id={props.id}>
      {items.map((itemObj, index) => {
        return (
          <div className="col-12" key={index}>
            <MenuItem
              item={itemObj}
              handleItemSelection={props.handleItemSelection}
            />
          </div>
        );
      })}
    </div>
  );
};

export default MenuCategory;
