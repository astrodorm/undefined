const jwt = require('jsonwebtoken');
const isEmail = require('validator/lib/isEmail');
const bcrypt = require('bcrypt');
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

exports.fetchAllStaffs = async (req, res) => {
  try {
    const staffs = await db.Staff.find({}).sort({ createdAt: -1 });
    res.status(200).json({ status: 200, data: staffs });
  } catch (e) {
    Emessage(e, res);
  }
};

exports.editStaff = async (req, res) => {
  try {
    if (req.body.oauth) {
      req.body.oauth = await bcrypt.hash(req.body.oauth, 10);
    }
    const staff = await db.Staff.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { new: true }
    );
    res.status(200).json({ status: 200, data: staff });
  } catch (e) {
    Emessage(e, res);
  }
};

exports.deleteStaff = async (req, res) => {
  try {
    console.log({ admin: req.admin._id });
    console.log(req.params.id);
    if (req.params.id == req.admin._id)
      return res
        .status(400)
        .json({ status: 400, message: `You can't delete yourself` });
    const deleted = await db.Staff.deleteOne({ _id: req.params.id });
    if (deleted.ok && deleted.n)
      return res
        .status(200)
        .json({ status: 200, data: `Staff successfully deleted` });

    return res
      .status(400)
      .json({ status: 400, message: `Staff already deleted` });
  } catch (e) {
    Emessage(e, res);
  }
};
