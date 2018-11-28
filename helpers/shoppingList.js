const db = require('../models');
const { Emessage } = require('../utils/err');
const { calculateTotalPrice } = require('../utils/totalCost');

exports.addToCart = async (req, res) => {
  try {
    let customerID = req.customer._id;

    if (!req.body.deliveryMethod)
      return res.status({
        status: 400,
        message: `Delivery method is important`
      });

    let cart = req.body.cart.map(item => ({
      list: item.productID,
      customerID,
      quantity: item.quantity,
      deliveryMethod: req.body.deliveryMethod,
      convenienceFee: req.body.convenienceFee,
      deliveryFee: req.body.deliveryFee,
      total: req.body.total
    }));
    let shoppingList = await db.ShoppingList.insertMany(cart);
    return res.status(200).json({ status: 200, data: shoppingList });
  } catch (e) {
    Emessage(e, res);
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    let customerID = req.customer._id;
    let _id = req.params.id;
    let cart = await db.ShoppingList.findOne({ customerID, _id });
    if (!cart)
      return res
        .status(400)
        .json({ status: 400, message: `No Item found in cart` });

    const item = await db.ShoppingList.deleteOne({ customerID, _id });

    if (item.ok && item.n)
      return res
        .status(200)
        .json({ status: 200, data: `Item successfully removed from cart` });

    return res
      .status(400)
      .json({ status: 400, message: `Item already removed from cart` });
  } catch (e) {
    Emessage(e, res);
  }
};

exports.fetchCustomerCart = async (req, res) => {
  try {
    let customerID = req.customer._id;
    let cart = await db.ShoppingList.find({ customerID }).sort({
      createdAt: -1
    });
    return res.status(200).json({ status: 200, data: cart });
  } catch (e) {
    Emessage(e, res);
  }
};
