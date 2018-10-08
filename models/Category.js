const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const catSchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: `Please enter category name`,
      trim: true
    },
    createdBy: String
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', catSchema);
