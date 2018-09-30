const jwt = require('jsonwebtoken');
const isEmail = require('validator/lib/isEmail');
const db = require('../models');
const { Emessage, Validator } = require('../utils/err');

exports.createStaff = async (req, res) => {
  try {
    let inputs = ['name', 'email', 'oauth'];

    let errMessages = Validator(inputs, req);
    if (errMessages.length >= 1)
      return res.status(400).json({ status: 400, message: errMessages });

    if (!isEmail(req.body.email))
      return res
        .status(400)
        .json({ status: 400, message: `Please enter an email address` });

    const exists = await db.Staff.findOne({ email: req.body.email });
    if (exists)
      return res
        .status(400)
        .json({ status: 400, message: `Staff with this email already exist` });

    const staff = await db.Staff.create(req.body);
    const token = await jwt.sign({ _id: staff._id }, process.env.SECRET, {
      expiresIn: '8760h'
    });
    res.status(200).json({ status: 200, data: { staff, token } });
  } catch (e) {
    Emessage(e, res);
  }
};

exports.staffLogin = async (req, res) => {
  try {
    const staff = await db.Staff.findOne({ email: req.body.email });
    if (!staff)
      return res
        .status(401)
        .json({ status: 401, message: `Email or Password Incorrect` });

    const pass = await staff.comparePassword(req.body.oauth);
    if (!pass)
      return res
        .status(401)
        .json({ status: 401, message: `Email or Password Incorrect` });

    const token = await jwt.sign({ _id: staff._id }, process.env.SECRET, {
      expiresIn: '8760h'
    });
    res.status(200).json({ status: 200, data: { staff, token } });
  } catch (e) {
    Emessage(e, res);
  }
};

exports.getStaff = async (req, res) => {
  try {
    return res.status(200).json({ status: 200, data: { staff: req.admin } });
  } catch (e) {
    Emessage(e, res);
  }
};
