const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const shoppingListSchema = new mongoose.Schema(
  {
    customerID: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Customer',
      index: true
    },
    list: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Product'
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('ShoppingList', shoppingListSchema);
