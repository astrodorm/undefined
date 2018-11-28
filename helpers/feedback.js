const db = require('../models');
const { Emessage } = require('../utils/err');

exports.giveFeedback = async (req, res) => {
  try {
    let customerID = req.customer._id;

    let order = await db.Order.findOne({
      customerID,
      driverReferenceNumber: { $exists: true }
    });

    if (!order)
      return res
        .status(400)
        .json({ status: 400, message: `You do not have an order` });

    let driver = await db.Driver.findOne({
      referenceNumber: order.driverReferenceNumber
    });

    if (!driver)
      return res.status(400).json({
        status: 400,
        message: `I guess no driver delivered your orders`
      });

    const feedBack = await db.FeedBack.create({
      rating: req.body.rating,
      message: req.body.message,
      driverID: driver._id,
      customerID
    });
    res.status(200).json({ status: 200, data: feedBack });
  } catch (e) {
    Emessage(e, res);
  }
};

exports.fetchAllFeedbacks = async (req, res) => {
  try {
    const feedBacks = await db.FeedBack.find({})
      .populate('driverID', 'firstname lastname referenceNumber')
      .populate('customerID', 'firstname lastname email')
      .sort({ createdAt: -1 });

    res.status(200).json({ status: 200, data: feedBacks });
  } catch (e) {
    Emessage(e, res);
  }
};
