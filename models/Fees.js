const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema(
  {
    convenience: Number,
    delivery: Number,
    maxConvenience: Number
  },
  { timestamps: true }
);

module.exports = mongoose.model('Fee', feeSchema);
