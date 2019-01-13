const mongoose = require('mongoose');

const catalogueSchema = new mongoose.Schema({
  itemCode: { type: String, index: true },
  thumbnail: String,
  itemName: { type: String, trim: true }
});

catalogueSchema.index({ itemName: 'text' });
module.exports = mongoose.model('Catalogue', catalogueSchema);
