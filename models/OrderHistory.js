const mongoose = require('mongoose');

const produceOrderSchema = new mongoose.Schema(
  {
    itemCode: String,
    productName: { type: String, trim: true },
    thumbnail: String,
    price: Number,
    merchantID: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Merchant'
    },
    customerID: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Customer'
    },
    quantity: {
      type: Number,
      default: 1
    },
    deliveryMethod: String,
    convenienceFee: Number,
    deliveryFee: Number,
    total: Number
  },
  { timestamps: true }
);

module.exports = mongoose.model('OrderHistory', produceOrderSchema);
