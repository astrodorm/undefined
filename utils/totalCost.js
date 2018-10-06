exports.calculateTotalPrice = list =>
  list.map(item => item.price).reduce((init, val) => init + val, 0);
