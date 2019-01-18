const db = require('../models');
const { Emessage } = require('../utils/err');

exports.createCustomerOrder = async (req, res) => {
  try {
    const customerID = req.customer._id;

    let shoppingList = await db.ShoppingListV2.find({ customerID });
    if (shoppingList.length < 1)
      return res.status(400).json({
        status: 400,
        message: `Customer does not yet have a shopping list`
      });

    const productOrdered = await Promise.all(
      shoppingList.map(async product => {
        let catalogue = await db.Catalogue.findOne({
          itemCode: product.itemCode
        });

        let thumbnail;
        if (catalogue && catalogue.thumbnail) {
          thumbnail = catalogue.thumbnail;
        }
        const item = {
          itemCode: product.itemCode,
          productName: product.productName,
          price: product.sellingPrice,
          thumbnail,
          // merchantID: product.list.merchantID,
          quantity: product.quantity,
          customerID,
          deliveryMethod: product.deliveryMethod,
          convenienceFee: product.convenienceFee,
          deliveryFee: product.deliveryFee,
          deliveryTime: product.deliveryTime,
          total: product.total
        };
        return item;
      })
    );

    console.log(productOrdered);

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
    let paymentReference = req.query.payref;
    let orders = await db.Order.create({
      productID: orderHistoryIDs,
      shopperReferenceNumber: shopper[0].referenceNumber,
      status: 'PENDING',
      driverReferenceNumber: 0,
      // totalCost,
      customerID,
      paymentReference,
      deliveryMethod: shoppingList[0].deliveryMethod,
      convenienceFee: shoppingList[0].convenienceFee,
      deliveryFee: shoppingList[0].deliveryFee,
      deliveryTime: shoppingList[0].deliveryTime,
      total: shoppingList[0].total
    });

    let shoppingListIds = shoppingList.map(item => item.itemCode);

    let cartEmptied = await db.ShoppingListV2.deleteMany({
      customerID,
      itemCode: { $in: shoppingListIds }
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
    let orderID = req.body.orderID;
    if (!orderID)
      return res.status(400).json({
        status: 400,
        message: `Please enter Order's _id`
      });
    if (!shopperReferenceNumber)
      return res.status(400).json({
        status: 400,
        message: `Please enter shopper's reference Number`
      });
    let status = req.body.status;
    const order = await db.Order.findOneAndUpdate(
      { _id: orderID, shopperReferenceNumber, status: { $ne: 'DELIVERED' } },
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
    const orders = await db.Order.find({}).sort({ createdAt: -1 });
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
    const orders = await db.Order.find({ customerID }).sort({ createdAt: -1 });
    res.status(200).json({ status: 200, data: orders });
  } catch (e) {
    Emessage(e, res);
  }
};
