const mongoose = require('mongoose');

const notFoundSchema = new mongoose.Schema(
  {
    searchedItem: String
  },
  { timestamps: true }
);

module.exports = mongoose.model('NotFound', notFoundSchema);
