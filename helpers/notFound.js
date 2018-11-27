const db = require('../models');
const { Emessage } = require('../utils/err');

exports.notFound = async (req, res) => {
  try {
    req.body.email = req.customer.email;
    req.body.phoneNumber = req.customer.phoneNumber;
    const notFound = await db.NotFound.create(req.body);
    res.status(200).json({ status: 200, data: notFound });
  } catch (e) {
    Emessage(e, res);
  }
};

exports.fetchNotFound = async (req, res) => {
  try {
    const notFounds = await db.NotFound.find({});
    res.status(200).json({ status: 200, data: notFounds });
  } catch (e) {
    Emessage(e, res);
  }
};

exports.editNotFound = async (req, res) => {
  try {
    let _id = req.params.id;
    let notFound = await db.NotFound.findOneAndUpdate(
      { _id },
      { $set: req.body },
      { new: true }
    );
    res.status(200).json({ status: 200, data: notFound });
  } catch (e) {
    Emessage(e, res);
  }
};

exports.getSingle = async (req, res) => {
  try {
    let _id = req.params.id;
    let notFound = await db.NotFound.findOne({ _id });
    res.status(200).json({ status: 200, data: notFound });
  } catch (e) {
    Emessage(e, res);
  }
};
