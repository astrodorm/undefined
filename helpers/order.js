const db = require('../models');
const { Emessage } = require('../utils/err');
const { calculateTotalPrice } = require('../utils/totalCost');

exports.createCustomerOrder = async (req, res) => {
  try {
    const customerID = req.customer._id;

    let shoppingList = await db.ShoppingList.find({ customerID });
    if (shoppingList.length < 1)
      return res.status(400).json({
        status: 400,
        message: `Customer does not yet have a shopping list`
      });

    let totalCost = shoppingList.reduce(
      (initial, item) => initial + item.quantity * item.list.price,
      0
    );

    const productOrdered = shoppingList.map(product => {
      const item = {
        productName: product.list.productName,
        price: product.list.price,
        thumbnail: product.list.thumbnail,
        merchantID: product.list.merchantID,
        quantity: product.quantity,
        customerID
      };
      return item;
    });

    const orderHistory = await db.OrderHistory.insertMany(productOrdered);

    const orderHistoryIDs = orderHistory.map(item => item._id);

    const shopper = await db.Shopper.find({})
      .sort({ numberOfShoppings: 1 })
      .limit(5);

    if (!shopper.length)
      return res.status(400).json({
        status: 400,
        message: `No Shopper to run errands has been added yet. Contact admin`
      });

    let orders = await db.Order.create({
      productID: orderHistoryIDs,
      shopperReferenceNumber: shopper[0].referenceNumber,
      status: 'PENDING',
      driverReferenceNumber: 0,
      totalCost,
      customerID
    });

    let shoppingListIds = shoppingList.map(item => item._id);
    console.log({ shoppingListIds });

    let cartEmptied = await db.ShoppingList.deleteMany({
      customerID,
      _id: { $in: shoppingListIds }
    });

    res.status(200).json({ status: 200, data: orders });
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

exports.getACustomerOrder = async (req, res) => {
  try {
    const customerID = req.customer._id;
    const orders = await db.Order.findOne({
      _id: req.params.orderID,
      customerID
    });
    return res.status(200).json({ status: 200, data: orders });
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

exports.getAllOrdersCustomer = async (req, res) => {
  try {
    const customerID = req.customer._id;
    const orders = await db.Order.find({ customerID });
    res.status(200).json({ status: 200, data: orders });
  } catch (e) {
    Emessage(e, res);
  }
};
