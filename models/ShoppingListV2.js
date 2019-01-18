const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const shoppingListSchema = new mongoose.Schema(
  {
    itemCode: { type: String, index: true },
    customerID: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Customer',
      index: true
    },
    productName: String,
    quantity: {
      type: Number,
      default: 1
    },
    deliveryMethod: String,
    convenienceFee: Number,
    deliveryFee: Number,
    total: Number,
    sellingPrice: Number,
    deliveryTime: String
  },
  { timestamps: true }
);

module.exports = mongoose.model('ShoppingListV2', shoppingListSchema);
