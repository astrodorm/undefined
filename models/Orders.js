const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const orderSchema = new mongoose.Schema({
  productID: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Product'
  },
  quantity: Number,
  shopperReferenceNo: Number,
  customerID: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Customer'
  },
  status: {
    type: String,
    trim: true
  },
  driverRefNo: Number,
  feedbackID: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Feedback'
  }
});

module.exports = mongoose.model('Order', orderSchema);
