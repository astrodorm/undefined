const db = require('../models');
const { Emessage } = require('../utils/err');
const { calculateTotalPrice } = require('../utils/totalCost');

exports.createCustomerOrder = async (req, res) => {
  try {
    const customerID = req.customer._id;

    let shoppingList = await db.ShoppingList.findOne({ customerID });
    if (!shoppingList)
      return res.status(400).json({
        status: 400,
        message: `Customer does not yet have a shopping list`
      });
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

    if (!shopper.length)
      return res.status(400).json({
        status: 400,
        message: `No Shopper to run errands has been added yet. Contact admin`
      });

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
    let totalCost = calculateTotalPrice(checkout.productID);
    await db.Shopper.updateOne(
      { _id: shopper[0]._id },
      { numberOfShoppings: ++shopper[0].numberOfShoppings }
    );
    res.status(200).json({ status: 200, data: checkout, totalCost });
  } catch (e) {
    Emessage(e, res);
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    // search order with shopperReferenceNumber where status is not DELIVERED and update status,
    let shopperReferenceNumber = req.body.shopperReferenceNumber;
    if (!shopperReferenceNumber)
      return res.status(400).json({
        status: 400,
        message: `Please enter shopper's reference Number`
      });
    let status = req.body.status;
    const order = await db.Order.findOneAndUpdate(
      { shopperReferenceNumber, status: { $ne: 'DELIVERED' } },
      { status },
      { new: true }
    );
    if (!order)
      return res.status(400).json({
        status: 400,
        message: `Please check shopper's reference number or the Order has been delivered`
      });

    res.status(200).json({ status: 200, data: order });
  } catch (e) {
    Emessage(e, res);
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await db.Order.find({});
    res.status(200).json({ status: 200, data: orders });
  } catch (e) {
    Emessage(e, res);
  }
};

exports.getOneOrder = async (req, res) => {
  try {
    const order = await db.Order.findOne({ _id: req.params.id });
    res.status(200).json({ status: 200, data: order });
  } catch (e) {
    Emessage(e, res);
  }
};

exports.updateOrder = async (req, res) => {
  try {
    // to allow for only status and driverReferenceNumber update

    let initial = await db.Order.findOne({ _id: req.params.id });
    let status = req.body.status ? req.body.status : initial.status;
    let driverReferenceNumber = req.body.driverReferenceNumber
      ? req.body.driverReferenceNumber
      : initial.driverReferenceNumber;

    const order = await db.Order.findOneAndUpdate(
      { _id: req.params.id },
      {
        status,
        driverReferenceNumber
      },
      { new: true }
    );
    res.status(200).json({ status: 200, data: order });
  } catch (e) {
    Emessage(e, res);
  }
};
