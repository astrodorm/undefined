const db = require('../models');
const { Emessage, Validator } = require('../utils/err');

exports.createdriver = async (req, res) => {
  try {
    if (
      isNaN(Number(req.body.phoneNumber)) ||
      isNaN(Number(req.body.referenceNumber))
    )
      return res.status(400).json({
        status: 400,
        message: `Only numeric values allowed for reference number and phone number`
      });

    const refNo = await db.Driver.findOne({
      referenceNumber: req.body.referenceNumber
    });
    if (refNo)
      return res.status(400).json({
        status: 400,
        message: `Shopper with this reference number already exist`
      });

    let inputs = ['firstname', 'lastname', 'phoneNumber', 'referenceNumber'];

    let errMessages = Validator(inputs, req);
    if (errMessages.length >= 1)
      return res.status(400).json({ status: 400, message: errMessages });

    req.body.createdBy = req.admin.email;
    const driver = await db.Driver.create(req.body);
    res.status(200).json({ status: 200, data: driver });
  } catch (e) {
    console.log(e);
    Emessage(e, res);
  }
};

exports.fetchdrivers = async (req, res) => {
  try {
    const drivers = await db.Driver.find({});
    res.status(200).json({ status: 200, data: drivers });
  } catch (e) {
    Emessage(e, res);
  }
};

exports.editdriver = async (req, res) => {
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

    const driver = await db.Driver.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    res.status(200).json({ status: 200, data: driver });
  } catch (e) {
    Emessage(e, res);
  }
};

exports.deletedriver = async (req, res) => {
  try {
    const driver = await db.Driver.deleteOne({ _id: req.params.id });
    if (driver.ok && driver.n)
      return res
        .status(200)
        .json({ status: 200, data: `driver successfully deleted` });

    return res
      .status(400)
      .json({ status: 400, message: `Couldn't delete driver` });
  } catch (e) {
    Emessage(e, res);
  }
};

exports.fetchAdriver = async (req, res) => {
  try {
    const driver = await db.Driver.findOne({ _id: req.params.id });
    res.status(200).json({ status: 200, data: driver });
  } catch (e) {
    Emessage(e, res);
  }
};
