const sortImagewise = (list, key) => {
  console.log({list, key});
  return list.sort((a, b) => (a[key] && !b[key] ? -1 : b[key] && !a[key] ? 1 : 0));
};

export {
  sortImagewise
}