const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const driverSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      trim: true
    },
    lastname: {
      type: String,
      trim: true
    },
    phoneNumber: Number,
    referenceNumber: Number,
    createdBy: String
  },
  { timestamps: true }
);

module.exports = mongoose.model('Driver', driverSchema);
