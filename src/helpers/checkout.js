const add = (acc, current) => acc + current;

const getItemsQuantity = (orderObject) => {
  const items = Object.values(orderObject || {});

  return items.map((item) => item.quantity).reduce(add, 0);
};

const getAmount = (orderObject) => {
  const items = Object.values(orderObject || {});

  return parseInt(
    items.map((item) => item.price * item.quantity).reduce(add, 0),
    10
  );
};

export { getItemsQuantity, getAmount };
