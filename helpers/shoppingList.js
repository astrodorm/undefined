const db = require('../models');
const { Emessage } = require('../utils/err');

exports.addToCart = async (req, res) => {
  try {
    let customerID = req.customer._id;

    let customerCart = await db.ShoppingList.findOne({ customerID });
    if (!customerCart) {
      customerCart = await db.ShoppingList.create({ customerID });
    }

    if (req.body.productID) {
      let shoppingCart = await db.ShoppingList.findOneAndUpdate(
        {
          _id: customerCart._id,
          customerID
        },
        { $addToSet: { list: req.body.productID } },
        { new: true }
      );
      return res.status(200).json({ status: 200, data: shoppingCart });
    }
    return res.status(200).json({ status: 200, data: customerCart });
  } catch (e) {
    Emessage(e, req);
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    let customerID = req.customer._id;
    let cart = await db.ShoppingList.findOne({ customerID });
    let shoppingCart = await db.ShoppingList.findOneAndUpdate(
      { _id: cart._id, customerID },
      { $pull: { list: req.body.productID } },
      { new: true }
    ).populate('list', 'productName price thumbnail');

    res.status(200).json({ status: 200, data: shoppingCart });
  } catch (e) {
    Emessage(e, req);
  }
};

exports.fetchCustomerCart = async (req, res) => {
  try {
    let customerID = req.customer._id;
    let cart = await db.ShoppingList.findOne({ customerID });
    if (!cart) {
      cart = await db.ShoppingList.create({ customerID });
    }
    return res.status(200).json({ status: 200, data: cart });
  } catch (e) {
    Emessage(e, req);
  }
};
