const db = require('../models');
const { Emessage } = require('../utils/err');

exports.createCustomerOrder = async (req, res) => {
  try {
    const customerID = req.customer._id;

    let shoppingList = await db.ShoppingList.findOne({ customerID });
    let quantity = shoppingList.list.length;

    // why find order and create if there's none is so that we only have one
    // record/document for a customer in the Order collection
    let order = await db.Order.findOne({ customerID });
    if (!order) {
      order = await db.Order.create({ customerID });
    }
    const checkout = await db.Order.findOneAndUpdate(
      {
        _id: order._id,
        customerID
      },
      {
        $set: { quantity },
        $addToSet: { productID: { $each: shoppingList.list } }
      },
      { new: true }
    );
    res.status(200).json({ status: 200, data: checkout });
  } catch (e) {
    Emessage(e, res);
  }
};

exports.handleOrder = async (req, res) => {
  
}
