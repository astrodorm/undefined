const jwt = require('jsonwebtoken');
const isEmail = require('validator/lib/isEmail');
const db = require('../models');

exports.createStaff = async (req, res) => {
  try {
    let inputs = ['name', 'email', 'oauth'];
    let err = [];
    for (let input of inputs) {
      if (!req.body[input]) err.push(`${input} is required`);
    }
    if (err.length >= 1) return res.status(400).json({ status: 400, err });

    if (!isEmail(req.body.email))
      return res
        .status(400)
        .json({ status: 400, message: `Please enter an email address` });

    const staff = await db.Staff.create(req.body);
    res.status(200).json({ status: 200, data: staff });
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
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
    return res.status(400).json({ status: 400, message: e.message });
  }
};
