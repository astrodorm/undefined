const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const shopperSchema = new mongoose.Schema(
  {
    fistname: {
      type: String,
      trim: true
    },
    lastname: {
      type: String,
      trim: true
    },
    phoneNumber: {
      type: Number,
      trim: true
    },
    company: {
      type: String,
      trim: true
    },
    referenceNumber: {
      type: Number,
      trim: true
    },
    createdBy: String
  },
  { timestamps: true }
);

module.exports = mongoose.model('Shopper', shopperSchema);
