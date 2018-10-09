const db = require('../models');
const { Emessage, Validator } = require('../utils/err');

exports.createshopper = async (req, res) => {
  try {
    if (
      isNaN(Number(req.body.phoneNumber)) ||
      isNaN(Number(req.body.referenceNumber))
    )
      return res
        .status(400)
        .json({
          status: 400,
          message: `Only numeric values allowed for reference number and phone number`
        });

    const refNo = await db.Shopper.findOne({
      referenceNumber: req.body.referenceNumber
    });
    if (refNo)
      return res.status(400).json({
        status: 400,
        message: `Shopper with this reference number already exist`
      });

    let inputs = [
      'firstname',
      'lastname',
      'phoneNumber',
      'referenceNumber',
      'company'
    ];

    let errMessages = Validator(inputs, req);
    if (errMessages.length >= 1)
      return res.status(400).json({ status: 400, message: errMessages });

    req.body.createdBy = req.admin.email;
    const shopper = await db.Shopper.create(req.body);
    res.status(200).json({ status: 200, data: shopper });
  } catch (e) {
    console.log(e);
    Emessage(e, res);
  }
};

exports.fetchshoppers = async (req, res) => {
  try {
    const shoppers = await db.Shopper.find({});
    res.status(200).json({ status: 200, data: shoppers });
  } catch (e) {
    Emessage(e, res);
  }
};

exports.editshopper = async (req, res) => {
  try {
    if (req.body.phoneNumber && isNaN(Number(req.body.phoneNumber)))
      return res.status(400).json({
        status: 400,
        message: `Only numeric values required for phone number`
      });

    if (req.body.referenceNumber && isNaN(Number(req.body.referenceNumber)))
      return res.status(400).json({
        status: 400,
        message: `Reference Number requires only numeric values`
      });

    const shopper = await db.Shopper.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    res.status(200).json({ status: 200, data: shopper });
  } catch (e) {
    Emessage(e, res);
  }
};

exports.deleteshopper = async (req, res) => {
  try {
    const shopper = await db.Shopper.deleteOne({ _id: req.params.id });
    if (shopper.ok && shopper.n)
      return res
        .status(200)
        .json({ status: 200, data: `shopper successfully deleted` });

    return res
      .status(400)
      .json({ status: 400, message: `Couldn't delete shopper` });
  } catch (e) {
    Emessage(e, res);
  }
};

exports.fetchAshopper = async (req, res) => {
  try {
    const shopper = await db.Shopper.findOne({ _id: req.params.id });
    res.status(200).json({ status: 200, data: shopper });
  } catch (e) {
    Emessage(e, res);
  }
};
