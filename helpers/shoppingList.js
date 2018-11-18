const db = require('../models');
const { Emessage } = require('../utils/err');
const { calculateTotalPrice } = require('../utils/totalCost');

exports.addToCart = async (req, res) => {
  try {
    let customerID = req.customer._id;

    /*     let [existing] = await db.ShoppingList.find({
      customerID,
      list: req.body.productID
    });

    if (req.body.quantity && isNaN(Number(req.body.quantity)))
      return res
        .status(400)
        .json({ status: 400, message: `quantity must be number` });

    if (existing) {
      let updatedShoppingList = await db.ShoppingList.findOneAndUpdate(
        {
          _id: existing._id
        },
        { quantity: req.body.quantity },
        { new: true }
      );

      return res.status(200).json({ status: 200, data: updatedShoppingList });
    }

    let newShoppingList = await db.ShoppingList.create({
      list: req.body.productID,
      customerID,
      quantity: req.body.quantity
    }); */
    let cart = req.body.cart.map(item => ({
      list: item.productID,
      customerID,
      quantity: item.quantity
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
    let cart = await db.ShoppingList.find({ customerID });
    return res.status(200).json({ status: 200, data: cart });
  } catch (e) {
    Emessage(e, res);
  }
};
