const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const orderSchema = new mongoose.Schema(
  {
    productID: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Product'
      }
    ],
    quantity: Number,
    shopperReferenceNumber: { type: Number, index: true },
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

function autopopulate(next) {
  this.populate('productID', 'productName price thumbnail');
  next();
}

orderSchema.pre('findOneAndUpdate', autopopulate);
orderSchema.pre('find', autopopulate);
orderSchema.pre('findOne', autopopulate);

module.exports = mongoose.model('Order', orderSchema);
