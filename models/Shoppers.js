const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const shopperSchema = new mongoose.Schema(
  {
    firstname: {
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
      trim: true,
      required: `Reference Number is required`,
      unique: true
    },
    createdBy: String
  },
  { timestamps: true }
);

module.exports = mongoose.model('Shopper', shopperSchema);
