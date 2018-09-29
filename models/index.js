const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const options = {
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 500,
  keepAlive: true
};

mongoose.connect(
  process.env.MONGODB_URI,
  options
);
mongoose.connection.on('error', err => {
  console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`);
});

module.exports.Merchant = require('./Merchants');
module.exports.Customer = require('./Customers');
module.exports.Shoppers = require('./Shoppers');
module.exports.Product = require('./Product');
module.exports.Order = require('./Orders');
module.exports.FeedBack = require('./Feedback');
module.exports.Courier = require('./Courier');
module.exports.Card = require('./Card');
