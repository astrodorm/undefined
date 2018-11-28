const db = require('../models');
const { Emessage, Validator } = require('../utils/err');

exports.createCourier = async (req, res) => {
  try {
    let inputs = ['companyName', 'companyAddress'];

    let errMessages = Validator(inputs, req);
    if (errMessages.length >= 1)
      return res.status(400).json({ status: 400, message: errMessages });

    req.body.createdBy = req.admin.email;
    const courier = await db.Courier.create(req.body);
    res.status(200).json({ status: 200, data: courier });
  } catch (e) {
    Emessage(e, res);
  }
};

exports.fetchCouriers = async (req, res) => {
  try {
    const couriers = await db.Courier.find({})
      .select('companyName companyAddress createdBy')
      .sort({ createdAt: -1 });
    res.status(200).json({ status: 200, data: couriers });
  } catch (e) {
    Emessage(e, res);
  }
};

exports.editCourier = async (req, res) => {
  try {
    const courier = await db.Courier.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    res.status(200).json({ status: 200, data: courier });
  } catch (e) {
    Emessage(e, res);
  }
};

exports.deleteCourier = async (req, res) => {
  try {
    const courier = await db.Courier.deleteOne({ _id: req.params.id });
    if (courier.ok && courier.n)
      return res
        .status(200)
        .json({ status: 200, data: `Courier successfully deleted` });

    return res
      .status(400)
      .json({ status: 400, message: `Couldn't delete courier` });
  } catch (e) {
    Emessage(e, res);
  }
};

exports.FetchACourier = async (req, res) => {
  try {
    const courier = await db.Courier.findOne({ _id: req.params.id });
    res.status(200).json({ status: 200, data: courier });
  } catch (e) {
    Emessage(e, res);
  }
};
