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
    const shopper = await db.Shopper.find({})
      .sort({ numberOfShoppings: 1 })
      .limit(5);

    const checkout = await db.Order.findOneAndUpdate(
      {
        _id: order._id,
        customerID
      },
      {
        $set: {
          quantity,
          status: 'PENDING',
          shopperReferenceNumber: shopper[0].referenceNumber
        },
        $addToSet: { productID: { $each: shoppingList.list } }
      },
      { new: true }
    );
    await db.Shopper.updateOne(
      { _id: shopper[0]._id },
      { numberOfShoppings: ++shopper[0].numberOfShoppings }
    );
    res.status(200).json({ status: 200, data: checkout });
  } catch (e) {
    Emessage(e, res);
  }
};

exports.handleOrder = async (req, res) => {};
