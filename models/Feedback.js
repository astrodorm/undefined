const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const feedBackSchema = new mongoose.Schema(
  {
    rating: Number,
    message: String,
    driverID: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Driver'
    },
    customerID: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Customer'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('FeedBack', feedBackSchema);
