const db = require('../models');
const { Emessage } = require('../utils/err');

exports.createCourier = async (req, res) => {
  try {
    let inputs = ['companyName', 'companyAddress'];
    let err = [];
    for (let input of inputs) {
      if (!req.body[input]) err.push(`${input} required`);
    }
    if (err.length >= 1)
      return res.status(400).json({ status: 400, message: err });

    req.body.createdBy = req.admin.email;
    const courier = await db.Courier.create(req.body);
    res.status(200).json({ status: 200, data: courier });
  } catch (e) {
    Emessage(e, res);
  }
};

exports.fetchCouriers = async (req, res) => {
  try {
    const couriers = await db.Courier.find({}).select(
      'companyName companyAddress createdBy'
    );
    res.status(200).json({ status: 200, data: couriers });
  } catch (e) {
    Emessage(e, res);
  }
};
