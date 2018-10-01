const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const productSchema = new mongoose.Schema(
  {
    thumbnail: String,
    productName: {
      type: String,
      required: 'Product name is required'
    },
    price: {
      type: Number,
      trim: true
    },
    merchantID: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Merchant'
    },
    isPickupAvailable: {
      type: Boolean,
      default: true
    },
    createdBy: String
  },
  { timestamps: true }
);

productSchema.index({ productName: 'text' });

function autoPopulate(next) {
  this.populate('merchantID', 'name city state location.address');
  next();
}

productSchema.pre('findOneAndUpdate', autoPopulate);
productSchema.pre('find', autoPopulate);

module.exports = mongoose.model('Product', productSchema);
