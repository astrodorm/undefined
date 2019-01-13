const mongoose = require('mongoose');

const product2Schema = mongoose.Schema(
  {
    itemCode: { type: String, trim: true, index: true },
    merchantID: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Merchant'
    },
    isPickupAvailable: {
      type: Boolean,
      default: true
    },
    createdBy: String,
    categoryID: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Category'
    }
  },
  { timestamps: true }
);

function autoPopulate(next) {
  this.populate('merchantID', 'name city state location.address').populate(
    'categoryID',
    'categoryName'
  );
  next();
}

product2Schema.pre('findOneAndUpdate', autoPopulate);
product2Schema.pre('find', autoPopulate);
product2Schema.pre('findOne', autoPopulate);

module.exports = mongoose.model('ProductV2', product2Schema);
