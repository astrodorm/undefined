const db = require('../models');
const { Emessage } = require('../utils/err');

exports.giveFeedback = async (req, res) => {
  try {
    let customerID = req.customer._id;

    let order = await db.Order.findOne({
      customerID,
      driverReferenceNumber: { $exists: true }
    });

    let driver = await db.Driver.findOne({
      referenceNumber: order.driverReferenceNumber
    });

    const feedBack = await db.FeedBack.create({
      rating: req.body.rating,
      message: req.body.message,
      driverID: driver._id
    });
    res.status(200).json({ status: 200, data: feedBack });
  } catch (e) {
    Emessage(e, res);
  }
};
