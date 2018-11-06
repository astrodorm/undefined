const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const shoppingListSchema = new mongoose.Schema(
  {
    list: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Product'
    },
    customerID: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Customer',
      index: true
    },
    quantity: {
      type: Number,
      default: 1
    }
  },
  { timestamps: true }
);

function autopopulate(next) {
  this.populate('list', 'productName price thumbnail');
  next();
}

shoppingListSchema.pre('findOne', autopopulate);
shoppingListSchema.pre('find', autopopulate);

module.exports = mongoose.model('ShoppingList', shoppingListSchema);
