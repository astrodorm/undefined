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

module.exports = mongoose.model('Product', productSchema);
