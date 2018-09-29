const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const courierSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: `Company's name is required`,
      trim: true
    },
    companyAddress: {
      type: String,
      required: `Company's address is required`,
      trim: true
    },
    createdBy: String
  },
  { timestamps: true }
);

module.exports = mongoose.model('Courier', courierSchema);
