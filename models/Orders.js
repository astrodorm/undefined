const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const orderSchema = new mongoose.Schema(
  {
    productID: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Product'
    },
    quantity: Number,
    shopperReferenceNumber: Number,
    customerID: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Customer'
    },
    status: {
      type: String,
      trim: true
    },
    driverReferenceNumber: Number,
    feedbackID: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Feedback'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
