const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const options = {
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 500,
  keepAlive: true,
  useNewUrlParser: true
};

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connect(
  process.env.MONGODB_URI,
  options
);
mongoose.connection.on('error', err => {
  console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`);
});

module.exports.Merchant = require('./Merchants');
module.exports.Customer = require('./Customers');
module.exports.Shopper = require('./Shoppers');
module.exports.Product = require('./Product');
module.exports.Order = require('./Orders');
module.exports.FeedBack = require('./Feedback');
module.exports.Courier = require('./Courier');
module.exports.Card = require('./Card');
module.exports.ShoppingList = require('./ShoppingList');
module.exports.Driver = require('./Driver');
module.exports.Staff = require('./Staff');
