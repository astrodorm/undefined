const db = require('../models');
const { Emessage } = require('../utils/err');

exports.addToCart = async (req, res) => {
  try {
    let customerID = req.customer._id;

    if (!req.body.deliveryMethod)
      return res.status({
        status: 400,
        message: `Delivery method is important`
      });

    let cart = req.body.cart.map(item => ({
      itemCode: item.itemCode,
      customerID,
      quantity: item.quantity,
      deliveryMethod: req.body.deliveryMethod,
      convenienceFee: req.body.convenienceFee,
      deliveryFee: req.body.deliveryFee,
      sellingPrice: item.sellingPrice,
      total: req.body.total,
      productName: item.productName
    }));
    let shoppingList = await db.ShoppingListV2.insertMany(cart);
    return res.status(200).json({ status: 200, data: shoppingList });
  } catch (e) {
    Emessage(e, res);
  }
};

exports.fetchCustomerCart = async (req, res) => {
  try {
    let customerID = req.customer._id;
    let cart = await db.ShoppingListV2.find({ customerID }).sort({
      createdAt: -1
    });
    let items = await Promise.all(
      cart.map(async item => {
        let catalogue = await db.Catalogue.findOne({ itemCode: item.itemCode });

        let thumbnail;
        if (catalogue && catalogue.thumbnail) {
          thumbnail = catalogue.thumbnail;
        }
        return {
          itemCode: item.itemCode,
          customerID,
          quantity: item.quantity,
          deliveryMethod: item.deliveryMethod,
          convenienceFee: item.convenienceFee,
          deliveryFee: item.deliveryFee,
          sellingPrice: item.sellingPrice,
          total: item.total,
          productName: item.productName,
          thumbnail
        };
      })
    );
    return res.status(200).json({ status: 200, data: items });
  } catch (e) {
    Emessage(e, res);
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    let customerID = req.customer._id;
    let itemCode = req.params.itemCode;
    let cart = await db.ShoppingListV2.findOne({ customerID, itemCode });
    if (!cart)
      return res
        .status(400)
        .json({ status: 400, message: `No Item found in cart` });

    const item = await db.ShoppingListV2.deleteOne({ customerID, itemCode });

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
