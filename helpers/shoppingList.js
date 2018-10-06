const db = require('../models');
const { Emessage } = require('../utils/err');
const { calculateTotalPrice } = require('../utils/totalCost');

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
      let totalCost = calculateTotalPrice(shoppingCart.list);
      return res
        .status(200)
        .json({ status: 200, data: shoppingCart, totalCost });
    }
    return res.status(200).json({ status: 200, data: customerCart });
  } catch (e) {
    Emessage(e, res);
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

    let totalCost = calculateTotalPrice(shoppingCart.list);

    res.status(200).json({ status: 200, data: shoppingCart, totalCost });
  } catch (e) {
    Emessage(e, res);
  }
};

exports.fetchCustomerCart = async (req, res) => {
  try {
    let customerID = req.customer._id;
    let cart = await db.ShoppingList.findOne({ customerID });
    if (!cart) {
      cart = await db.ShoppingList.create({ customerID });
    }
    let quantity = cart.list.length;

    let totalCost = calculateTotalPrice(cart.list);

    return res
      .status(200)
      .json({ status: 200, data: cart, quantity, totalCost });
  } catch (e) {
    Emessage(e, res);
  }
};
