import React from "react";
import css from "./MenuItem.module.scss";
import classnames from "classnames";

const MenuItem = (props) => {
  const { item } = props;

  return (
    <div className={css.item}>
      <div className={css.image}>
        <img
          className={"img-fluid"}
          src={item.item_image_thumb_url || item.item_tag_image}
          alt="food"
        />
      </div>
      <div className={css.description}>
        <div className={css.name}>{item.name}</div>
        <div className={css.buyWrapper}>
          <span className={css.price}>Rs. {item.price || item.min_price}</span>
          <span className={css.price}>
            <button onClick={() => props.handleItemSelection(item)}>Add</button>
            <div className={css.edit}>
              <span onClick={() => props.handleItemSelection(item, "remove")}>
                -
              </span>
              <span>{"quantity"}</span>
              <span onClick={() => props.handleItemSelection(item)}>+</span>
            </div>
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
