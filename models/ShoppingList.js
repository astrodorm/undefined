const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const shoppingListSchema = new mongoose.Schema(
  {
    customerID: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Customer',
      index: true
    },
    list: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Product'
      }
    ]
  },
  { timestamps: true }
);

function autopopulate(next) {
  this.populate('list', 'productName price thumbnail');
  next();
}

shoppingListSchema.pre('findOneAndUpdate', autopopulate);
shoppingListSchema.pre('findOne', autopopulate);

module.exports = mongoose.model('ShoppingList', shoppingListSchema);
