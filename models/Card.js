const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const cardSchema = new mongoose.Schema(
  {
    customerID: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Customer'
    },
    last4Digits: {
      type: Number,
      trim: true
    },
    token: String,
    expiryMonth: Number,
    expiryYear: Number,
    bank: String,
    reference: String,
    cardType: String,
    countryCode: String
  },
  { timestamps: true }
);

module.exports = mongoose.model('Card', cardSchema);
