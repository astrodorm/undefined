const db = require('../models');
const { Emessage, Validator } = require('../utils/err');

exports.createFees = async (req, res) => {
  try {
    if (req.body.convenience && isNaN(Number(req.body.convenience)))
      return res.status(400).json({
        status: 400,
        message: `Convenience fee must be numbers`
      });

    if (req.body.delivery && isNaN(Number(req.body.delivery)))
      return res.status(400).json({
        status: 400,
        message: `Delivery fee must be numbers`
      });
    if (req.body.maxConvenience && isNaN(Number(req.body.maxConvenience)))
      return res.status(400).json({
        status: 400,
        message: `Maximum convenience fee must be numbers`
      });
    if (req.body.minDelivery && isNaN(Number(req.body.minDelivery)))
      return res.status(400).json({
        status: 400,
        message: `Minimum Delivery fee must be numbers`
      });
    if (req.body.maxDelivery && isNaN(Number(req.body.maxDelivery)))
      return res.status(400).json({
        status: 400,
        message: `Maximum Delivery fee must be numbers`
      });
    let inputs = [
      'convenience',
      'delivery',
      'maxConvenience',
      'minDelivery',
      'maxDelivery'
    ];

    let errMessages = Validator(inputs, req);
    if (errMessages.length >= 1)
      return res.status(400).json({ status: 400, message: errMessages });

    let fees = await db.Fees.create(req.body);
    res.status(200).json({ status: 200, data: fees });
  } catch (e) {
    Emessage(e, res);
  }
};

exports.fetchfees = async (req, res) => {
  try {
    const fees = await db.Fees.find({}).sort({ createdAt: -1 });
    res.status(200).json({ status: 200, data: fees });
  } catch (e) {
    Emessage(e, res);
  }
};

exports.editfee = async (req, res) => {
  try {
    if (req.body.convenience && isNaN(Number(req.body.convenience)))
      return res.status(400).json({
        status: 400,
        message: `Convenience fee must be numbers`
      });

    if (req.body.delivery && isNaN(Number(req.body.delivery)))
      return res.status(400).json({
        status: 400,
        message: `Delivery fee must be numbers`
      });

    if (req.body.maxConvenience && isNaN(Number(req.body.maxConvenience)))
      return res.status(400).json({
        status: 400,
        message: `Maximum convenience fee must be numbers`
      });

    const fee = await db.Fees.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    res.status(200).json({ status: 200, data: fee });
  } catch (e) {
    Emessage(e, res);
  }
};

exports.deletefee = async (req, res) => {
  try {
    const fee = await db.Fees.deleteOne({ _id: req.params.id });
    if (fee.ok && fee.n)
      return res
        .status(200)
        .json({ status: 200, data: `fee successfully deleted` });

    return res
      .status(400)
      .json({ status: 400, message: `fee seems to have been deleted already` });
  } catch (e) {
    Emessage(e, res);
  }
};

exports.fetchAfee = async (req, res) => {
  try {
    const fee = await db.Fees.findOne({ _id: req.params.id });
    res.status(200).json({ status: 200, data: fee });
  } catch (e) {
    Emessage(e, res);
  }
};
