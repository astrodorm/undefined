const mongoose = require('mongoose');

const notFoundSchema = new mongoose.Schema(
  {
    searchedItem: String,
    email: String,
    phoneNumber: String,
    status: String
  },
  { timestamps: true }
);

module.exports = mongoose.model('NotFound', notFoundSchema);
